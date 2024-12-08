const likes = document.querySelectorAll(".fa-thumbs-up")
const trash = document.querySelectorAll(".fa-trash")

likes.forEach(like => like.addEventListener("click", addLike)) 
  
  async function addLike() {
    console.log("Clicked:", this.parentNode.parentNode.childNodes[3].innerText)
    const sDate = this.parentNode.parentNode.childNodes[1].innerText
    const sName = this.parentNode.parentNode.childNodes[3].innerText
    const tLikes = Number(
      this.parentNode.parentNode.childNodes[11].innerText
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
  }

trash.forEach(tCan => tCan.addEventListener("click", deleteOne))

async function deleteOne(){
    const sDate = this.parentNode.parentNode.childNodes[1].innerText
    const sName = this.parentNode.parentNode.childNodes[3].innerText

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
  }
