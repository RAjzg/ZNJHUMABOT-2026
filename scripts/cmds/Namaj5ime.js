const axios = require("axios");
const cron = require("node-cron");
const moment = require("moment-timezone"); // সময় ফরম্যাটের জন্য এটি প্রয়োজন: npm install moment-timezone

const baseApiUrl = async () => {
    const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
    return base.data.mahmud;
};

module.exports = {
    config: {
        name: "azanreminder",
        version: "3.0",
        author: "MahMUD",
        role: 2,
        description: {
            bn: "আযানের সময় হলে সময় ও তারিখসহ অটোমেটিক মেসেজ পাঠাবে",
            en: "Automatically send azan alerts with full date and time"
        },
        category: "Islamic"
    },

    onLoad: async function ({ api }) {
        const city = "Dhaka"; 
        const authorName = "MahMUD";

        console.log(`[AZAN-SYSTEM] Azan reminder system started for ${city}`);

        // প্রতিদিন রাত ১২টা ১ মিনিটে নতুন দিনের আযানের সময় আপডেট করবে
        cron.schedule('1 0 * * *', async () => {
            await this.setupAzanAlarms(api, city, authorName);
        }, {
            scheduled: true,
            timezone: "Asia/Dhaka"
        });

        await this.setupAzanAlarms(api, city, authorName);
    },

    setupAzanAlarms: async function (api, city, authorName) {
        try {
            const baseUrl = await baseApiUrl();
            const apiUrl = `${baseUrl}/api/namaz/font3/${encodeURIComponent(city)}`;
            const response = await axios.get(apiUrl, { headers: { "author": authorName } });

            if (!response.data || response.data.error) return;

            const prayers = {
                "ফজর": response.data.Fajr,
                "যোহর": response.data.Dhuhr,
                "আসর": response.data.Asr,
                "মাগরিব": response.data.Maghrib,
                "এশা": response.data.Isha
            };

            Object.entries(prayers).forEach(([name, time]) => {
                if (!time) return;

                const [timePart, modifier] = time.split(' ');
                let [hours, minutes] = timePart.split(':');
                if (modifier === 'PM' && hours !== '12') hours = parseInt(hours) + 12;
                if (modifier === 'AM' && hours === '12') hours = '00';

                cron.schedule(`${minutes} ${hours} * * *`, async () => {
                    // বর্তমান সময় ও তারিখ সংগ্রহ
                    const now = moment().tz("Asia/Dhaka");
                    const fullTime = now.format("hh:mm:ss A"); // ঘণ্টা:মিনিট:সেকেন্ড
                    const fullDate = now.format("DD/MM/YYYY"); // তারিখ/মাস/বছর
                    const dayName = now.locale('bn').format("dddd"); // বারের নাম (বাংলায়)

                    const msg = `🕌 আযানের সময় হয়েছে!\n\n` +
                                `🕋 নামাজের ওয়াক্ত: ${name}\n` +
                                `⏰ সময়: ${fullTime}\n` +
                                `📅 তারিখ: ${fullDate}\n` +
                                `🗓️ দিন: ${dayName}\n` +
                                `📍 শহর: ${city}\n\n` +
                                `〲নুরনবী卝 JHUMAཐི༏ཋྀ`;

                    const threadList = await api.getThreadList(50, null, ["INBOX"]);
                    threadList.forEach(thread => {
                        if (thread.isGroup) {
                            api.sendMessage(msg, thread.threadID);
                        }
                    });
                }, {
                    scheduled: true,
                    timezone: "Asia/Dhaka"
                });
            });

            console.log("[AZAN-SYSTEM] Alarms updated with full date/time format.");
        } catch (err) {
            console.error("Azan Setup Error:", err);
        }
    },

    onStart: async function ({ message }) {
        return message.reply("আযান রিমাইন্ডার সচল আছে। এটি আযানের সময় হলে স্বয়ংক্রিয়ভাবে সময়, তারিখ এবং বারের নামসহ মেসেজ পাঠাবে।");
    }
};
                                   
