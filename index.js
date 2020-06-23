const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config();

const { FRIEND_ID, COOKIE, START_CURSOR } = process.env;

const fetchUrl = `https://www.instagram.com/direct_v2/web/threads/${FRIEND_ID}`;
const fetchReferrer = `https://www.instagram.com/direct/t/${FRIEND_ID}`;

const headers = {};
headers["Cookie"] = COOKIE;
headers["Referer"] = fetchReferrer;
headers["x-ig-app-id"] = "936619743392459"; // ig web app id

const resultStream = fs.createWriteStream("messages.json");

const fetchInstagramCursor = async (cursor) => {
  const resp = await fetch(`${fetchUrl}?cursor=${cursor}`, { method: "GET", headers });
  return resp.json();
};

const recursiveCall = (oldcursor) => {
  fetchInstagramCursor(oldcursor).then((resp) => {
    resultStream.write(JSON.stringify(resp, null, 2) + ",\n");
    if (resp.thread.has_older) {
      recursiveCall(resp.thread.oldest_cursor);
    } else {
      console.log("done");
      resultStream.end();
    }
  });
};

recursiveCall(START_CURSOR);