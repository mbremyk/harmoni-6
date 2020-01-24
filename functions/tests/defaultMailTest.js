const defaultMail = require('../defaultMail.js');
const moment = require('moment');

let dm = new defaultMail.DefaultMail();

beforeEach(done => {
    dm.user = "user";
    dm.date = moment(new Date(2020, 0, 1)).format('YYYY-MM-DD');
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
            date: moment(new Date(2020, 0, 1)).format('YYYY-MM-DD'),
            text: "text",
            subject: "subject",
            email: "email",
            password: "password",
            hilsen: `\nMed vennlig hilsen\nHarmoni team 6 support team`
        });
        done();
    });

    it("generates correct texts", done => {
        expect(dm.bugText).toBe(`Hei, user\n\n` +
            `Vi har mottatt din rapport og har satt våre fremste utviklere på saken.\n` +
            `\nDitt support-nummer er 123456\n` +
            `På 2020-01-01 skrev du: \n\ntext\n\n` +
            `Hvis du har spørsmål eller mer informasjon kan du sende det som svar på denne mailen\n` +
            `\nMed vennlig hilsen\nHarmoni team 6 support team`);
        done();
    })
});