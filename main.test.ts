import { expect, test } from '@jest/globals';
const JsonURL = require("@jsonurl/jsonurl");
const fs = require('fs');

let path = './test-data/test_data.json'

function main() {
    if (!fs.existsSync(path)) {
        throw `missing ${path}`
    }
    let data_file_text = fs.readFileSync(path, { encoding: "utf8" });
    let data = JSON.parse(data_file_text)

    for (const [key, val] of Object.entries(data)) {
        if (key == "$schema") {
            continue;
        }
        test(key, function () {
            let item = data[key];
            let type = item["type"];
            if (type == "roundtrip" || type === undefined) {
                let text = item.text
                let data = item.data
                expect(JsonURL.parse(text)).toEqual(data)
                expect(JsonURL.stringify(data)).toEqual(text)
            } else if (type == "fail") {
                let text = item.text
                expect(() => JsonURL.parse(text)).toThrow();
            } else if (type == "load") {
                let text = item.text
                let data = item.data
                expect(JsonURL.parse(text)).toEqual(data)
            } else {
                throw `bad test type ${type}`
            }
        });
    }
}

main();

export { }
