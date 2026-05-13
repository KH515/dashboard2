export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    }
  })

  if (res.status === 401) {
    try {
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      if (refreshRes.ok) {
        return fetch(url, {
          ...options,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          }
        })
      } else {
        window.location.href = "/login"
      }
    } catch {
      window.location.href = "/login"
    }
  }

  return res
}