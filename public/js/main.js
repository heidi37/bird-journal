const likes = document.querySelectorAll(".fa-thumbs-up")
const trash = document.querySelectorAll(".fa-trash")

likes.forEach(like => like.addEventListener("click", addLike)) 
  
  async function addLike() {
    const selectedId = this.parentNode.parentNode.dataset.id

    try {
      const response = await fetch("likeEntry", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          'idFromClientJs': selectedId,
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
    const selectedId = this.parentNode.parentNode.dataset.id

    try {
      const response = await fetch("deleteEntry", {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          'idFromClientJs': selectedId,
        }),
      })
      const data = await response.json()
      console.log(data)
      location.reload()
    } catch (err) {
      console.log(err)
    }
  }
