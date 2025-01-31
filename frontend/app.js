const hbs = expHbs.create({ // HBS settings
defaultLayout:'main',    // main layout is "main"
extname:'hbs'      //.hbs
})
app.engine('hbs',hbs.engine) // Connecting the engine using the key hbs
app.set('view engine', 'hbs')// To use HBS by default, the setting name must match the string in app.engine
app.set('views','views') // Configuring the location where the views of our application will be located using the key views