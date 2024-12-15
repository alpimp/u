// Cloudflare Function for handling form submission
export async function onRequest(context) {
  const { request, env } = context;

  const url = new URL(request.url);
  const ref = request.headers.get('referer');
  const pparams = url.searchParams;

  console.log('ref is ' + ref);
  console.log('my params are  ' + pparams);

  const ip1 = request.headers.get("Cf-Connecting-Ip");
  let ip = ip1;

  if (ip) {
    console.log("X-Forwarded-For is " + ip);
  } else {
    ip = request.headers.get("Cf-Connecting-Ip");
    console.log("Getting IP from CF-Connecting-IP:" + ip);
  }

  const date = new Date();
  const dt = date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  if (url.pathname === '/submit') {
    console.log('Submitting Form Results...');

    const ipToUse = ip || "";
    await handleFormSubmit(ipToUse, dt, request, env);
    return new Response("go!");
  }

  return new Response("404 PAGE NOT FOUND");
}

async function createNotionPage(body, env) {
  return fetch(`${env.API_PATH}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${env.NOTION_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
  }).then(res => res.json()).catch(err => console.error(err));
}

async function handleFormSubmit(i, d, request, env) {
  const requestBody = {
    parent: {
      database_id: `${env.DB_ID}`,
    },
    properties: {
      Display: {
        title: [
          {
            text: {
              content: "BL",
            },
          },
        ],
      },
      Touch: {
        rich_text: [
          {
            text: {
              content: "BL",
            },
          },
        ],
      },
      Lang: {
        rich_text: [
          {
            text: {
              content: "BL",
            },
          },
        ],
      },
      TZ: {
        rich_text: [
          {
            text: {
              content: "BL",
            },
          },
        ],
      },
      "FDB type": {
        multi_select: [
          {
            name: "BL",
          },
        ],
      },
      Messaga: {
        rich_text: [
          {
            text: {
              content: d,
            },
          },
        ],
      },
      Location: {
        rich_text: [
          {
            text: {
              content: "BL",
            },
          },
        ],
      },
      IP: {
        rich_text: [
          {
            text: {
              content: i,
            },
          },
        ],
      },
      Accel: {
        rich_text: [
          {
            text: {
              content: "Waiting..",
            },
          },
        ],
      },
    },
  };

  await createNotionPage(requestBody, env);
  const rty = JSON.stringify(requestBody);
  console.info(rty);
}
