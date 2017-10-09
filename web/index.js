const express = require("express");
const session = require("express-session");
const cookie = require("cookie-parser");
const ejs = require("ejs");

const R = require("rethinkdbdash");
const RDBStore = require("express-session-rethinkdb")(session);

const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;

const config = require("./../config.json")

const app = express();

const database = {
	reThinkDB: {
		host: "localhost",
		port: "28015",
		db: "snowwolf",
		buffer: 10
	}
};

const r = new R({
	servers: [
		database.reThinkDB
	]
});

require("rethinkdb-init")(r);
r.init(database.reThinkDB, ["session"]);

const store = new RDBStore({
	connectOptions: {
		servers: [
			database.reThinkDB
		],
		db: "snowwolf",
		discovery: false,
		pool: true,
		buffer: 50,
		max: 1000,
		timeout: 20,
		timeoutError: 1000
	},
	table: "session",
	sessionTimeout: 86400000,
	flushInterval: 60000,
	debug: false
});

app.engine("ejs", ejs.renderFile);
app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");

app.use(cookie());

function checkAuthenticated(req, res, next) {
	if(req.isAuthenticated()) { return next; }
	res.redirect("/");
	return true;
}

function getAuthUser(user) {
	return {
		username: user.username,
		discriminator: user.discriminator,
		id: user.id,
		avatar: user.avatar ? (`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`) : "https://kyubey.info/images/default_avatar.png"
	};
}

const scopes = ["identify", "email", "guilds"];

passport.use(new DiscordStrategy({
	clientID: config.client_id,
	clientSecret: config.client_secret,
	callbackURL: `${config.hosting_url}login/callback`,
	scope: scopes
}, (accessToken, refreshToken, profile, done) => {
	process.nextTick(() => {
		return done(null, profile);
	});
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
	store: store,
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
	res.status(500).send(error);
	console.error(error);
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
	failureRedirect: "/login"
}), (req, res) => {
	res.redirect("/");
});

app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

app.listen(config.server_port, config.server_ip, () => {
	console.log("Server Running");
});
