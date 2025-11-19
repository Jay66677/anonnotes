// client/src/services/ApiClient.js
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  getOptions(method = "GET", body = null, isForm = false) {
    const options = {
      method,
      credentials: "include", // ★ send cookies every request!
      headers: {}
    };

    if (!isForm) {
      options.headers["Content-Type"] = "application/json";
    }

    if (body) {
      options.body = isForm ? body : JSON.stringify(body);
    }

    return options;
  }

  async get(path) {
    const response = await fetch(this.baseURL + path, this.getOptions("GET"));
    return this.handleResponse(response);
  }

  async post(path, body, isForm = false) {
    const response = await fetch(
      this.baseURL + path,
      this.getOptions("POST", body, isForm)
    );
    return this.handleResponse(response);
  }

  async delete(path) {
    const response = await fetch(
      this.baseURL + path,
      this.getOptions("DELETE")
    );
    return this.handleResponse(response);
  }

  async handleResponse(response) {
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: "Error" }));
      throw new Error(err.message);
    }
    return response.json();
  }
}

const BASE_URL = import.meta.env.VITE_API_URL;

console.log(BASE_URL); //debugging url thing

export default new ApiClient(BASE_URL);
