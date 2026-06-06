const fs = require('fs');
const path = require('path');

const screens = [
  {
    name: 'instructor_dashboard',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2NkZDVjMGZjMzQ5YzQ0MWM5ZjEzNTI3NTU4Njg3OGZmEgsSBxD8xMiHuQ4YAZIBIwoKcHJvamVjdF9pZBIVQhMzNTE1ODA2NTM3NjM3MDg2NDEy&filename=&opi=89354086'
  },
  {
    name: 'instructor_agenda',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2QxM2E4NmI2ZWE1ZTQ4MjA4MTA1OTQ2OWJjMjg3NjEyEgsSBxD8xMiHuQ4YAZIBIwoKcHJvamVjdF9pZBIVQhMzNTE1ODA2NTM3NjM3MDg2NDEy&filename=&opi=89354086'
  },
  {
    name: 'instructor_students_list',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2Y5ZjFiNWUyZjBhNzQ1M2JiYTY4MjE0YWNlZTZhY2VkEgsSBxD8xMiHuQ4YAZIBIwoKcHJvamVjdF9pZBIVQhMzNTE1ODA2NTM3NjM3MDg2NDEy&filename=&opi=89354086'
  },
  {
    name: 'instructor_finance',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzNhOGY1MzU4MmY1ZjQzNWRiMTE2MThmMzNkY2NmODE4EgsSBxD8xMiHuQ4YAZIBIwoKcHJvamVjdF9pZBIVQhMzNTE1ODA2NTM3NjM3MDg2NDEy&filename=&opi=89354086'
  },
  {
    name: 'instructor_student_details',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzZiZTY5ODU2NjkwNzRlMjFhYmM5NGY2YzExZmQ4MGExEgsSBxD8xMiHuQ4YAZIBIwoKcHJvamVjdF9pZBIVQhMzNTE1ODA2NTM3NjM3MDg2NDEy&filename=&opi=89354086'
  },
  {
    name: 'instructor_profile_vehicle',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzUzODk1NTllNDE3MjQzZjFhN2NiMTkxNTUyMzI2NjA2EgsSBxD8xMiHuQ4YAZIBIwoKcHJvamVjdF9pZBIVQhMzNTE1ODA2NTM3NjM3MDg2NDEy&filename=&opi=89354086'
  },
  {
    name: 'instructor_create_service',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzUyNTcwMTdmYzYyNjRiZDY4ZjAwYzNjYjc4ZTE2NDQzEgsSBxD8xMiHuQ4YAZIBIwoKcHJvamVjdF9pZBIVQhMzNTE1ODA2NTM3NjM3MDg2NDEy&filename=&opi=89354086'
  },
  {
    name: 'student_home',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzU3MDMyMWQxYTZjZDQ4NjVhYWMzYjAyYzRmZWZlNzczEgsSBxD8xMiHuQ4YAZIBIwoKcHJvamVjdF9pZBIVQhMzNTE1ODA2NTM3NjM3MDg2NDEy&filename=&opi=89354086'
  },
  {
    name: 'student_progress',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzJkYjZjMzkxYWFhZjQ1NmFiNzRlMjIzNWY0ZGJlNDRlEgsSBxD8xMiHuQ4YAZIBIwoKcHJvamVjdF9pZBIVQhMzNTE1ODA2NTM3NjM3MDg2NDEy&filename=&opi=89354086'
  }
];

const destDir = path.join(__dirname, 'downloaded_screens');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

async function download() {
  for (const screen of screens) {
    console.log(`Downloading ${screen.name}...`);
    try {
      const res = await fetch(screen.url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const text = await res.text();
      fs.writeFileSync(path.join(destDir, `${screen.name}.html`), text);
      console.log(`Saved ${screen.name}.html`);
    } catch (e) {
      console.error(`Error downloading ${screen.name}:`, e);
    }
  }
}

download();
