from bs4 import BeautifulSoup

import json

import requests

html = requests.get("https://pt.surebet.com/surebets").content

soup = BeautifulSoup(html, 'html.parser')

qtd = soup.findAll("tbody", class_="surebet_record")

allArbs = []


for arb in qtd:
    trs = arb.findAll("tr")
    if len(trs[2].findAll("td", class_="extra")) == 0:
        bookmakers = trs[0].findAll("td", class_="booker")[0].find("a").getText()
        event = trs[0].findAll("td", class_="event")[0].find("a").getText()
        coeff = trs[0].findAll("td", class_="coeff")[0].find("abbr").getText()
        value = trs[0].findAll("td", class_="value")[0].find("a").getText()

        bookmakers1 = trs[1].findAll("td", class_="booker")[0].find("a").getText()
        event1 = trs[1].findAll("td", class_="event")[0].find("a").getText()
        coeff1 = trs[1].findAll("td", class_="coeff")[0].find("abbr").getText()
        value1 = trs[1].findAll("td", class_="value")[0].find("a").getText()

        bookmakers2 = trs[2].findAll("td", class_="booker")[0].find("a").getText()
        event2 = trs[2].findAll("td", class_="event")[0].find("a").getText()
        coeff2 = trs[2].findAll("td", class_="coeff")[0].find("abbr").getText()
        value2 = trs[2].findAll("td", class_="value")[0].find("a").getText()

        obj = [
            {
            "bookmaker": bookmakers,
            "event": event,
            "result": coeff,
            "odds": value
            },
            {
            "bookmaker": bookmakers1,
            "event": event1,
            "result": coeff1,
            "odds": value1
            },
            {
            "bookmaker": bookmakers2,
            "event": event2,
            "result": coeff2,
            "odds": value2
            },
            ]

        allArbs.append(obj)
    else:
        bookmakers = trs[0].findAll("td", class_="booker")[0].find("a").getText()
        event = trs[0].findAll("td", class_="event")[0].find("a").getText()
        coeff = trs[0].findAll("td", class_="coeff")[0].find("abbr").getText()
        value = trs[0].findAll("td", class_="value")[0].find("a").getText()

        bookmakers1 = trs[1].findAll("td", class_="booker")[0].find("a").getText()
        event1 = trs[1].findAll("td", class_="event")[0].find("a").getText()
        coeff1 = trs[1].findAll("td", class_="coeff")[0].find("abbr").getText()
        value1 = trs[1].findAll("td", class_="value")[0].find("a").getText()

        obj = [
            {
            "bookmaker": bookmakers,
            "event": event,
            "result": coeff,
            "odds": value
            },
            {
            "bookmaker": bookmakers1,
            "event": event1,
            "result": coeff1,
            "odds": value1
            }
            ]

        allArbs.append(obj)

print(json.dumps(allArbs, indent=4))
