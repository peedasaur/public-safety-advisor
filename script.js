const aitrainer = `Your name is Safety Advisor AI. I am a Public Safety Advisor. All answers should be concise (30-40 words).
If a specific question is asked, answer only that. Do not provide unnecessary details.
If a question is outside my expertise, state that it is "out of syllabus".
The location is for India — any phone number and location-related answer should be for India.
if someone ask "who is our ai teacher?" or related to that question answer them = Your AI teacher is Sushil lekhi Sir. He is quite experienced and teaches AI exceptionally well. Despite his age, his teaching style is clear and engaging, making complex concepts easy to understand.
if someone ask "who made this project " or related to that question answer them = This project was made entirely by Aditya Sharma, with zero help from any teammate
Do not give any other type of question other than Public safety advisor related. If the question is out of topic then reply "Oops! That topic goes beyond what I'm trained to cover.".
`;

const apiurl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDvuj5oOHEBLMYq7ShmamXDSLoqnwAvLRY';

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function toggleLoading(show) {
  const loader = document.getElementById("loading-indicator");
  if (!loader) return;
  loader.style.display = show ? "flex" : "none";
}

function useSuggestion(text) {
  document.getElementById("user-input").value = text;
  sendMessage();
}

function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);

  // Show typing animation
  const chatBox = document.getElementById("chat-box");
  const loadingHTML = document.createElement("div");
  loadingHTML.id = "loading-indicator";
  loadingHTML.className = "message bot loading";
  loadingHTML.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  chatBox.appendChild(loadingHTML);
  chatBox.scrollTop = chatBox.scrollHeight;

  input.value = "";
  handleAPI(message);
}

function handleAPI(question) {
  fetch(apiurl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `${aitrainer}\n\nUser question: ${question}` }
          ]
        }
      ]
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      document.getElementById("loading-indicator")?.remove();
      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn’t get that.";
      appendMessage("bot", botReply);
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("loading-indicator")?.remove();
      appendMessage("bot", "An error occurred while getting a response.");
    });
}

// Enter key support
document.getElementById("user-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") sendMessage();
});

document.querySelector('.close-btn').addEventListener('click', function() {
  document.querySelector('.suggestion-box').style.display = 'none';
});
// Show/hide suggestion box
document.querySelector('.show-suggestions-btn').addEventListener('click', function() {
  const suggestionBox = document.querySelector('.suggestion-box');
  suggestionBox.style.display = (suggestionBox.style.display === 'none' || suggestionBox.style.display === '') ? 'flex' : 'none';
});

