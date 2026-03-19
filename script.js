// const fetch = require("node-fetch");

const client_id = "b026060cb3ec43bbb87b35e2c661e792";
const client_secret = "7704e00c284043608070369e839803e4";
const code = "AQCKGy1Acp9SDXT4b0lWDEIIkiQA3w9zj6czXWjeYpPpc-lKfSmhcU9WssuJX4xK_ZNHroQuCkT9Ff9E-Bnh4RFrVFG5zmT0HeDLaUrzTt5MdCxZROWnorGZjBw19PSMqdmUiNK1Z-639QqfEJmtGYyDvkPTdiPDRR1KXwaU_OBqe_cSAPbJ5VUCxepscIw3m_vinEJ4j38z9HHWrgJw279ku06fn-O7aCMeUmjIZs3w";

const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    "Authorization": `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: "https://jamesuchechi-website.vercel.app/callback"
  })
})
.then(res => res.json())
.then(data => console.log(data));

