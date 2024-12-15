// Cloudflare Function for handling click events
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

  let myURL = `${env.TRACKER}`;
    const statusCode = 301;

  if (url.pathname === '/click') {
    if (ref) {
      switch (true) {
        case ref.includes('uz-6mw'): {
          myURL = "https://casino-house.online/F6OHsp";
          break;
        }
        case ref.includes('d-tea'): {
          myURL = "https://datingforyour.xyz/dating-all-geo/";
          break;
        }
        case ref.includes('local'): {
          myURL = "https://datingforyour.xyz/dating-all-geo/";
          break;
        }
        default: {
          myURL = myURL;
          break;
        }
      }
    } else {
      myURL =  `${env.TRACKER}`; // Or a different default URL
    }

    console.log('Submitting Form Results...');

    const ipToUse = ip || "";
    await handleFormSubmit1(ref, ipToUse, dt, request, env);

    let destinationURL;
    if (!pparams) {
      destinationURL = myURL;
    } else {
      destinationURL = myURL + '?' + pparams;
    }

    return Response.redirect(destinationURL, statusCode);
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

async function handleFormSubmit1(rr, i, d, request, env) {
  const requestBody1 = {
    parent: {
      database_id: `${env.DB2_ID}`,
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
              content: rr,
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

  await createNotionPage(requestBody1, env);
  const rty = JSON.stringify(requestBody1);
  console.info(rty);
}
