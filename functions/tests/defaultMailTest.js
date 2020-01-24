const defaultMail = require('../defaultMail.js');

let dm = new defaultMail.DefaultMail();

beforeEach(done => {
    dm.user = "user";
    dm.date = new Date(2020, 1, 1);
    dm.text = "text";
    dm.subject = "subject";
    dm.email = "email";
    dm.password = "password";
    done();
});

describe('Test of DefaultMail', () => {
    it("has the correct properties", done => {
        expect(dm).toEqual({
            user: "user",
            date: new Date(2020, 1, 1),
            text: "text",
            subject: "subject",
            email: "email",
            password: "password",
            hilsen: `\nMed vennlig hilsen\nHarmoni team 6 support team`
        });
        done();
    })
});