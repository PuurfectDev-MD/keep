# Keep

Keep is an all-in-one journalling web app for you to keep track of your life moments and memories through images, audio and videos (coming soon). You can save memories with a title, detailed description and multiple pictures to enrich your journal timeline. You can also add voice memos in the voice page where you speak openly about your feelings and mood to reflect upon later.

The website is built to integrate with a custom made journal device, [life_in_pocket](https://github.com/PuurfectDev-MD/life_in_pocket), where an ESP32 device lets you capture pictures, record videos and audio and upload them to your Keep account through an API. Keep works perfectly without the device, but to enjoy the full experience of keeping your life in pocket, consider building life_in_pocket or request a pre-made device.

---

## Why build Keep?

The same reason I built life_in_pocket.

I have always feared that life will just slip by while I am on autopilot. To tackle that fear I have always been keen on journalling and capturing moments to reminisce later. Building Keep and life_in_pocket has allowed me to do exactly that, capture life.

---

## Stack

| Layer | Name |
|---|---|
| Framework | SvelteKit 5 |
| Auth, Database, Storage | Supabase |
| ORM | Drizzle |
| Email | Gmail SMTP |
| Styling | Tailwind CSS |

---

## Features

**Memories** — A memory is a specific moment in your life packaged as a single entry with images, a title and a description, all uploaded to Keep.

**Voice logs** — Record and reflect on your day, feelings and mood. Upload voice memos to log them into your timeline.

**Timeline** — An up-to-date journal view where all your memories and voice memos come together. Filter by week, month, quarter or up to a full year of saved content.

**API connectivity** — Connect your ESP journal device to log memories and voice from anywhere, without needing a phone or PC. Each user is assigned one API key which is inserted into the ESP device firmware.

 See [life_in_pocket](https://github.com/PuurfectDev-MD/life_in_pocket) for more details.

---

## Future Work

- Video upload support
- Individual memory viewing
- Settings page, calendar page and core user functionality completion

---

## Contributing

Feel free to reach out with suggestions or bug reports. I would be happy to work with anyone who wants to contribute to the project.

---


*Made with love ❤️*