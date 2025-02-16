export async function onRequest(context) {
  const { request, env } = context;

  const url = new URL(request.url);
  const ref = request.headers.get('referer') || '';
  const country_code = request.cf.country || 'Unknown';
  const tz = request.cf.timezone || 'Unknown';
  const asn = request.cf.asn || 'Unknown';
  const pparams = url.searchParams;

  console.log('ref is ' + ref);
  console.log('my params are ' + pparams);

  const ip1 = request.headers.get("Cf-Connecting-Ip");
  const ip = ip1 || "";

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

  console.log('Submitting Form Results...');

  await handleFormSubmit(ref, ip, dt, tz, country_code, env);

  let destinationURL = env.TRACKER;
  if (pparams && pparams.toString()) {
    destinationURL += '?' + pparams.toString();
  }

  console.log('Redirecting to: ' + destinationURL);

  return Response.redirect(destinationURL, 303);
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
  })
  .then(res => res.json())
  .catch(err => {
    console.error(err);
    throw err;
  });
}

async function handleFormSubmit(rr, i, d, tz, country_code, env) {
  try {
    const requestBody = {
      parent: {
        database_id: env.DB2_ID,
      },
      properties: {
        Display: { title: [{ text: { content: "BL" } }] },
        Touch: { rich_text: [{ text: { content: "BL" } }] },
        Lang: { rich_text: [{ text: { content: country_code } }] },
        TZ: { rich_text: [{ text: { content: tz } }] },
        "FDB type": { multi_select: [{ name: "BL" }] },
        Messaga: { rich_text: [{ text: { content: d } }] },
        Location: { rich_text: [{ text: { content: rr } }] },
        IP: { rich_text: [{ text: { content: i } }] },
        Accel: { rich_text: [{ text: { content: "Waiting.." } }] },
      },
    };

    await createNotionPage(requestBody, env);
    console.info(JSON.stringify(requestBody));
  } catch (error) {
    console.error('Error handling form submit:', error);
  }
}
