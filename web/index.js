const express = require("express");
const session = require("express-session");
const ejs = require("ejs");

const R = require("rethinkdbdash");
const RDBStore = require("express-session-rethinkdb");

const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;

const config = require("./../config.json")

const app = express();

const database = {
	reThinkDB: {
		host: "localhost",
		port: "28015",
		db: "snowwolf",
		buffer: parseInt("10", 10)
	}
};

const r = new R({
	servers: [
		database.reThinkDB
	]
});
const RDBStoreSession = new RDBStore(session);

const store = new RDBStoreSession(r, {
	browserSessionsMaxAge: 60000,
});

app.engine("ejs", ejs.renderFile);
app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");

function checkAuthenticated(req, res, next) {
	if(req.isAuthenticated()) { return next; }
	res.redirect("/");
	return true;
}

function getAuthUser(user) {
	return {
		username: user.username,
		id: user.id,
		avatar: user.avatar ? (`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`) : "https://kyubey.info/images/default_avatar.png"
	}
}

const scopes = ["identify", "email", "guilds"];

passport.use(new DiscordStrategy({
	clientID: config.client_id,
	clientSecret: config.client_secret,
	callbackURL: "http://localhost:1337/login/callback",
	scope: scopes
}, (accessToken, refreshToken, profile, done) => {
	process.nextTick(() => {
		return done(null, profile);
	})
}));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((id, done) => {
	done(null, id);
});

app.use(session({
	secret: "cIGxEWj4PwbnasdurJzS",
	resave: false,
	saveUninitialized: false,
	store,
	cookie: {
		httpOnly: true,
		sameSite: true,
		secure: "auto",
		maxAge: 2592000000
	}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((error, req, res, next) => {
	res.sendStatus(500);
	res.render("error.ejs", {error});
});

app.get("/", (req, res) => {
	const uptime = process.uptime();
	res.render("landing.ejs", {
		authUser: req.isAuthenticated() ? getAuthUser(req.user) : null
	});
});

app.get("/login", passport.authenticate("discord", {
	scope: scopes
}));

app.get("/login/callback", passport.authenticate("discord", {
	failureRedirect: "/"
}), (req, res) => {
	res.redirect("/");
});

const server = app.listen(1337, "localhost", () => {
	process.setMaxListeners(0);
});
