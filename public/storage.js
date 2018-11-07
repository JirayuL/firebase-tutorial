let file
let uploadTask

function addFile() {
  file = document.getElementById('input-file').files[0]
  console.log(file.name)
}

function uploadFile() {
  uploadTask = firebase.storage().ref(file.name).put(file)

  uploadTask.on(
    'state_changed',
    function onProgress(snapshot) {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      document.getElementById('progress').innerText = progress + '%'
    },
    function onError(error) {
      console.log(error)
    },
    function onComplete() {
      firebase.storage().ref(file.name).getDownloadURL().then(url => {
        document.getElementById('progress')
          .innerHTML = `Completed!! download at: <a href="${url}">Download here!</a>`
        firebase.database().ref('files').push({
          name: file.name,
          url
        })
      })
    }
  )
}

function pauseFile() {
  uploadTask.pause()
}

function resumeFile() {
  uploadTask.resume()
}

function cancelFile() {
  uploadFile.cancel()
}

firebase.database().ref('files').on('value', snapshot => {
  const list = Object.values(snapshot.val())
  document.getElementById('file-list').innerText = ''
  for (let file of list) {
    document.getElementById('image-list').innerHTML += `<a href="${file.url}">${file.name}</a><br>`
  }
})
