const axios = require("axios");
const fs = require("fs");
const request = require("request");

const emojiAudioMap = {
 "🥺": {
 url: "https://drive.google.com/uc?export=download&id=1Gyi-zGUv5Yctk5eJRYcqMD2sbgrS_c1R",
 caption: "মিস ইউ বেপি...🥺"
 },
 "😍": {
 url: "https://drive.google.com/uc?export=download&id=1lIsUIvmH1GFnI-Uz-2WSy8-5u69yQ0By",
 caption: "তোমার প্রতি ভালোবাসা দিনকে দিন বাড়ছে... 😍"
 },
 "😭": {
 url: "https://drive.google.com/uc?export=download&id=1qU27pXIm5MV1uTyJVEVslrfLP4odHwsa",
 caption: "জান তুমি কান্না করতেছো কোনো... 😭"
 },
 "😡": {
 url: "https://drive.google.com/uc?export=download&id=1S_I7b3_f4Eb8znzm10vWn99Y7XHaSPYa",
 caption: "রাগ কমাও, মাফ করাই বড়ত্ব... 😡"
 },
 "🙄": {
 url: "https://drive.google.com/uc?export=download&id=1gtovrHXVmQHyhK2I9F8d2Xbu7nKAa5GD",
 caption: "এভাবে তাকিও না তুমি ভেবে লজ্জা লাগে ... 🙄"
 },
 "😑": {
 url: "https://drive.google.com/uc?export=download&id=1azElOD2QeaMbV2OdCY_W3tErD8JQ3T7P",
 caption: "লেবু খাও জান সব ঠিক হয়ে যাবে 😑"
 },
 "😒": {
 url: "https://drive.google.com/uc?export=download&id=1tbKe8yiU0RbINPlQgOwnig7KPXPDzjXv",
 caption: "বিরক্ত করো না জান... ❤️"
 },
 "🤣": {
 url: "https://drive.google.com/uc?export=download&id=1Hvy_Xee8dAYp-Nul7iZtAq-xQt6-rNpU",
 caption: "হাসলে তোমাকে পাগল এর মতো লাগে... 🤣"
 },
 "💔": {
 url: "https://drive.google.com/uc?export=download&id=1jQDnFc5MyxRFg_7PsZXCVJisIIqTI8ZY",
 caption: "feel this song... 💔"
 },
 "🙂": {
 url: "https://drive.google.com/uc?export=download&id=1_sehHc-sDtzuqyB2kL_XGMuvm2Bv-Dqc",
 caption: "তুমি কি আধো আমাকে ভালোবাসো ... 🙂"
 }
};

module.exports.config = {
 name: "emoji_voice",
 version: "1.7",
 hasPermssion: 0,
 credits: "Islamick Chat Modified by Cyber-Sujon",
 description: "10 emoji = 10 voice response",
 commandCategory: "noprefix",
 usages: "🥺 😍 😭 etc.",
 cooldowns: 5
};

module.exports.handleEvent = async ({ api, event }) => {
 const { threadID, messageID, body } = event;
 if (!body) return;

 const emoji = body.trim();
 const audioData = emojiAudioMap[emoji];

 if (!audioData) return;

 const filePath = `${__dirname}/cache/${encodeURIComponent(emoji)}.mp3`;

 const callback = () => api.sendMessage({
 body: `╭•┄┅════❁🌺❁════┅┄•╮\n\n${audioData.caption}\n\n╰•┄┅════❁🌺❁════┅┄•╯`,
 attachment: fs.createReadStream(filePath)
 }, threadID, () => fs.unlinkSync(filePath), messageID);

 const stream = request(encodeURI(audioData.url));
 stream.pipe(fs.createWriteStream(filePath)).on("close", () => callback());
};

module.exports.run = () => {};
