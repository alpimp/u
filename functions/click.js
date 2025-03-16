export async function onRequest(context) {
  const { request, env } = context;

    let formData;
try {
  formData = await request.formData();
} catch (error) {
  console.error('Error parsing form data:', error);
  formData = new FormData(); // Default to empty
}
  const url = new URL(request.url);
  const ref = request.headers.get('referer') || '';
  //const ref = formData?.get("demo_val") ?? 'Unknown';
  const country_code = request.cf?.country ?? 'Unknown';
  const tz = request.cf?.timezone ?? 'Unknown';
  const asn = request.cf?.asn ?? 'Unknown';
  const pparams = url.searchParams;
  const accel = formData.get("alpha_val") || 'Unknown';
  const touch = formData.get("touch") || 'Unknown';
  const display = formData.get("display") || 'Unknown';
  const ua = formData.get("get_ua") || 'Unknown';

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

  await handleFormSubmit(ref, ip, dt, tz, asn, country_code, accel, touch, display, ua, env);

//  let destinationURL = env.TRACKER;
  let destinationURL ='https://18dbne.mcgo2.com/click';
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// uncomment if search params have to be appended to the destination url 
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 
//  if (pparams && pparams.toString()) {
//    destinationURL += '?' + pparams.toString();
//  }

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

async function handleFormSubmit(rr, i, d, tz, asn, country_code, accel, touch, display, ua, env) {
  try {
    const requestBody = {
      parent: {
        database_id: env.DB2_ID,
      },
      properties: {
        Display: { title: [{ text: { content: display } }] },
        Touch: { rich_text: [{ text: { content: touch } }] },
        Lang: { rich_text: [{ text: { content: country_code } }] },
        TZ: { rich_text: [{ text: { content: tz } }] },
        "FDB type": { rich_text: [{ text: { content: String(asn) } }] },
        Messaga: { rich_text: [{ text: { content: d } }] },
        Location: { rich_text: [{ text: { content: rr } }] },
        IP: { rich_text: [{ text: { content: i } }] },
        Accel: { rich_text: [{ text: { content: accel } }] },
        UA: { rich_text: [{ text: { content: ua } }] },
      },
    };

    await createNotionPage(requestBody, env);
    console.info(JSON.stringify(requestBody));
  } catch (error) {
    console.error('Error handling form submit:', error);
  }
}
