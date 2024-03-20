profile = (req, res) => {
    res.send('profile');
};


profileEdit = (req, res) => {
    res.send('profile edit');
};

module.exports = {
    profile,
    profileEdit
};