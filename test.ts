const file = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20220928T010000Z
DTEND:20220928T020000Z
SUMMARY:title
DESCRIPTION:description
LOCATION:location
END:VEVENT
END:VCALENDAR

BEGIN:MEOW
VERSION:2
  BEGIN:RUFF
    VERSION:3
  END:RUFF
  NAME:BAZ
  BEGIN:RUFF
    VERSION:3
  END:RUFF
FOO:BAZ
END:MEOW

{
  meow: {
    version: 2
    name: 'baz'
    ruff: [{
      version: 3
    }, {
      version: 3
    }]
  }
}

`

const parse = (input: string) => {
  const data = {}
  let lastKey;

  input.split('\n').forEach((line: string) => {
    if (line.match(/^[A-Z]+:/)) {
      const data = line.match(/^([A-Z]+):(.*)$/)
      lastKey = data[1]
      data[lastKey] = [data[2]]
    } else {
      data[lastKey].push(line)
    }
  })
}

parse(file)

const file2 = `
BEGIN:VCALENDAR
  PRODID:kordinator
  VERSION:2.0
  CALSCALE:GREGORIAN
  METHOD:REQUEST
  BEGIN:VEVENT
    BEGIN:VALARM
      TRIGGER:-P1D
      ACTION:DISPLAY
      DESCRIPTION:Reminder
      BEGIN:VALARM
        TRIGGER:-P1D
        ACTION:DISPLAY
        DESCRIPTION:Reminder
      END:VALARM
    END:VALARM
    DTSTAMP:20220926T180701Z
    DTSTART:20221025T211500Z
    DTEND:20221025T213000Z
    SUMMARY:Wellness Clinic Appointment
    LOCATION:Kabuki Theater  121 Albright Way Los Gatos\\, CA\\, 95032\\, Flu va
    ccine will be offered to people 3 years and older and Omicron Booster to
      people 12 years and older\n\nIMPORTANT REMINDERS for all Participants\n
    -    Complete and bring printed copy of consent form \n-    Bring CDC vaccine 
    card for booster dose COVID-19 vaccine \n-    Wear a short sleeve if possib
    le\n\nNew Bivalent Boosters will be available for eligible people 12 yea
    rs and older. However\\, vaccine is not guaranteed due to limited supply
    DESCRIPTION:Wellness Clinic Appointment.\n\nLocation : Kabuki Theater  12
    1 Albright Way Los Gatos\\, CA\\, 95032\\, Flu vaccine will be offered to p
    eople 3 years and older and Omicron Booster to people 12 years and older
    \n\nIMPORTANT REMINDERS for all Participants\n-    Complete and bring print
    ed copy of consent form \n-    Bring CDC vaccine card for booster dose COVI
    D-19 vaccine \n-    Wear a short sleeve if possible\n\nNew Bivalent Booster
    s will be available for eligible people 12 years and older. However\\, va
    ccine is not guaranteed due to limited supply\n\nReschedule:  https://ko
    rdinator.mhealthcoach.net/vcl/704291252\n\n
    ORGANIZER;CN=Albertsons Patient Care:vknoreply@my-secure-message.com
    UID:VK_704291239
    SEQUENCE:184229937
    ATTENDEE;ROLE=REQ-PARTICIPANT:mailto:bschmeisser@netflix.com
    BEGIN:VALARM
      TRIGGER:-PT15M
      ACTION:DISPLAY
      DESCRIPTION:Reminder
    END:VALARM
  END:VEVENT
END:VCALENDAR
`


console.log(file, file2)
