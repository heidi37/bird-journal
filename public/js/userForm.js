console.log("JS loaded")

const imageUpload = document.getElementById("cloudinaryId")
const imagePreview = document.getElementById("avatar")

imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      avatar.src = e.target.result // Set preview image
    }
    reader.readAsDataURL(file)
  }
})


  
