const axios = require("axios");

module.exports = {
    config: {
        name: "automsg",
        version: "1.0",
        author: "MahMUD",
        countDown: 5,
        role: 2, // শুধুমাত্র অ্যাডমিনরা এটি নিয়ন্ত্রণ করতে পারবে
        description: {
            bn: "প্রতি এক ঘণ্টা পর পর নির্দিষ্ট মেসেজ পাঠাবে",
            en: "Sends a specific message every hour",
            vi: "Gửi tin nhắn cụ thể sau mỗi giờ"
        },
        category: "System",
        guide: {
            bn: "{pn}",
            en: "{pn}",
            vi: "{pn}"
        }
    },

    // বট চালু হওয়ার সাথে সাথে এই ফাংশনটি কাজ শুরু করবে
    onLoad: async function ({ api }) {
        const targetMessage = "〲নুরনবী卝 JHUMAཐི༏ཋྀ";
        
        // প্রতি ১ ঘণ্টা (৩৬০০০০০ মিলি-সেকেন্ড) পর পর এটি লুপ হবে
        setInterval(async () => {
            const allThreads = await api.getThreadList(100, null, ["INBOX"]);
            
            allThreads.forEach(thread => {
                // শুধুমাত্র গ্রুপগুলোতে মেসেজ পাঠাতে চাইলে (অথবা নির্দিষ্ট কোনো ID দিতে পারেন)
                if (thread.isGroup) {
                    api.sendMessage(targetMessage, thread.threadID, (err) => {
                        if (err) console.error(`Error sending auto message to ${thread.threadID}:`, err);
                    });
                }
            });
            
            console.log(`[AUTO-MSG] Message sent at: ${new Date().toLocaleString()}`);
        }, 3600000); // ১ ঘণ্টা = ৬০ মিনিট * ৬০ সেকেন্ড * ১০০০ মিলি-সেকেন্ড
    },

    onStart: async function ({ api, event, message }) {
        return message.reply("এই কমান্ডটি অটোমেটিক কাজ করে। প্রতি এক ঘণ্টা পর পর মেসেজ পাঠানো হবে।");
    }
};
