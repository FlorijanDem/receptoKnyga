# Some "hacks"

### 📌 Introduction

Welcome to the **Additional** documentation. Here you can find some tricks.

---

### Info

If you want to copy-paste in browser console you need type:

```sh
allow pasting
```

## Login without Login Page

In react project if you want to login without interact with login page you can just login with browser console just type:

```sh
fetch("http://localhost:3001/api/v1/auth/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: "john@email.com",  // email
        password: "password1" // password
    }),
    credentials: "include"
})
.then(response => response.json()) // Parsing the JSON response
.then(data => console.log(data)) // Log the response data
.catch(error => console.error("Error:", error));
```