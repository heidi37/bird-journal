const today = new Date().toISOString().split("T")[0]
document.getElementById("date").value = today

const likes = document.querySelectorAll(".fa-thumbs-up")
const trash = document.querySelectorAll(".fa-trash")

console.log(likes)

likes.forEach((like) => {
  like.addEventListener("click", async function (e) {
    // Send PUT Request here
    const sDate = e.target.parentNode.parentNode.childNodes[1].innerText
    const sName = e.target.parentNode.parentNode.childNodes[3].innerText
    const tLikes = Number(
      e.target.parentNode.parentNode.childNodes[11].innerText
    )

    try {
      const response = await fetch("addOneLike", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateS: sDate,
          commonNameS: sName,
          likesS: tLikes,
        }),
      })
      const data = await response.json()
      console.log(data)
      location.reload()
    } catch (err) {
      console.log(err)
    }
  })
})

trash.forEach((tCan) => {
  tCan.addEventListener("click", async function (e) {
    // Send PUT Request here
    const sDate = e.target.parentNode.parentNode.childNodes[1].innerText
    const sName = e.target.parentNode.parentNode.childNodes[3].innerText

    try {
      const response = await fetch("deleteEntry", {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateS: sDate,
          commonNameS: sName,
        }),
      })
      const data = await response.json()
      console.log(data)
      location.reload()
    } catch (err) {
      console.log(err)
    }
  })
})
