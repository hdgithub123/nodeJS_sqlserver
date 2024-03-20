homePage = (req, res) => {
    res.send('Welcome to the home page');
};


homeAbout = (req, res) => {
    res.send('Welcome to the home about');
};

module.exports = {
    homePage,
    homeAbout
};