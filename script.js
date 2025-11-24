const emailMessage = document.getElementById("email-suggestion");
const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const commonDomains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "aol.com",
  "outlook.com",
  "wp.pl",
  "onet.pl",
  "interia.pl",
  "o2.pl",
  "icloud.com",
  "me.com",
  "mac.com",
];

function levenshteinMatrix(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      const cost = str2[i - 1] === str1[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[str2.length][str1.length];
}

function closestMatch(input, domains) {
  let bestMatch = null;
  let bestScore = Infinity;
  domains.forEach((element) => {
    const distance = levenshteinMatrix(input, element);
    if (distance < bestScore && distance <= 3) {
      bestScore = distance;
      bestMatch = element;
    }
  });
  return bestMatch;
}

emailInput.addEventListener("input", () => {
  const input = emailInput.value;
  if (!input.includes("@")) {
    emailMessage.innerText = "";
    return;
  }

  const [local, domain] = input.split("@");

  const match = closestMatch(domain, commonDomains);

  if (match && match !== domain) {
    emailMessage.innerHTML = `<span id="suggestion" style="cursor: pointer;">Did you mean: <span id="suggestion-text" style="color: #800e13">${local}@${match}</span>?</span>`;
    emailMessage.style.display = "flex";

    const suggestion = document.getElementById("suggestion");
    suggestion.addEventListener("click", () => {
      emailInput.value = `${local}@${match}`;
      emailMessage.innerText = "";
    });
  } else {
    emailMessage.innerText = "";
  }
});

