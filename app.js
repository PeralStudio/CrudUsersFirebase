// Initializar cloud Storage Firebase...
  firebase.initializeApp({
    apiKey: 'AIzaSyAvnTHIjlD_xN92aud9jbj9XojG7-QUfRU',
    authDomain: 'pruebalistaitems.firebaseapp.com',
    projectId: 'pruebalistaitems'
  });

var db = firebase.firestore();
/* var idEditing = '' */

//Leer documentos de Firebase...
var tabla = document.getElementById('tabla');
db.collection("usuarios").onSnapshot((querySnapshot) => {
  tabla.innerHTML = '';
  querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().nombre}, ${doc.data().apellido}, ${doc.data().edad}`);
      tabla.innerHTML += 
      `<tr class="item" id="${doc.id}">
      <td id="${doc.id}_nombre">${doc.data().nombre}</td>
      <td id="${doc.id}_apellido">${doc.data().apellido}</td>
      <td id="${doc.id}_edad">${doc.data().edad}</td>
      <td class="td-delete"><button class="btn btn-danger" onClick="eliminar('${doc.id}')">Eliminar</button></td>
      <td class="td-edit"><button class="btn btn-warning" onClick="editar('${doc.id}')">Editar</button></td>
    </tr>`
  });
});

{/* <td class="td-edit"><button class="btn btn-warning" onClick="editar('${doc.id}', '${doc.data().nombre}', '${doc.data().apellido}', '${doc.data().edad}')">Editar</button></td> */}

//Cambiar fondo body...
function backgroundColor() {
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = Math.floor(Math.random() * 256);
    var bgColor = "rgb(" + x + "," + y + "," + z + ")";
    console.log("fondobody",bgColor);
    document.getElementById("body").style.background = bgColor;
    }


//restablecer color fondo...
function restablecer() {
    document.getElementById("body").style.background = "#0a3b43";
}

//evento del teclado en el campo filtro
filtro.addEventListener('keyup', filtrarItems);

//Comprobar si los campos estan vacios
function inputNull(){
  var newItemNombre = document.getElementById('nombre').value;
  var newItemApellido = document.getElementById('apellido').value;
  var newItemEdad = document.getElementById('edad').value;
  if ( newItemNombre === "" || newItemApellido === "" || newItemEdad === "" ) {

    Toastify({
      text: "Todos los campos són obligatórios",
      backgroundColor: "linear-gradient(0deg, rgba(220,54,69,1) 0%, rgba(61,10,15,1) 98%)",
      duration: 3000
      }).showToast();

      return true;
    }
    else{
      return false;
    }
}

//Funcion para agregar un usuario a la lista...
function agregarItem(){

    if ( ! inputNull() ){
    /* Toastify({
        text:  `Item  Agregado`,
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        duration: 3000
        }).showToast(); */

        //Guardar DAtos en Cloud Storage Firebase
        var nameForFirebase = document.getElementById('nombre').value;
        var apellidoForFirebase = document.getElementById('apellido').value;
        var edadForFirebase = document.getElementById('edad').value;

        db.collection("usuarios").add({
          nombre: nameForFirebase,
          apellido: apellidoForFirebase,
          edad: edadForFirebase
        })
        
        Swal.fire({
          title: 'Usuario Agregado: ',
          text: `Nombre: ${nameForFirebase}` + "\n " + `Apellido: ${apellidoForFirebase}`,
          icon: 'success',
          showClass: {
            popup: 'animate__animated animate__backInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__backOutDown'
          },
          timer: 2000,
          showConfirmButton: false,
        })
        .then(function(docRef) {
          document.getElementById('nombre').value = "";
          document.getElementById('apellido').value = "";
          document.getElementById('edad').value = "";
        })
        .catch(function(error) {
          console.error("Error al añadir el Usuario: ", error);
        });

        
    }
}

function resetForm(){
  //var boton = document.getElementById('boton');
  document.getElementById('nombre').value = "";
  document.getElementById('apellido').value = "";
  document.getElementById('edad').value = "";
  boton.value = "Añadir";
  boton.onclick =  function(){agregarItem()};

  var buttonCancel = document.querySelector('.cancelar');
  buttonCancel.classList.add('no-visible');
  buttonCancel.classList.remove('visible');

  var h1EditUsers = document.querySelector('#titlechange');
  h1EditUsers.textContent = 'Agregar Usuarios';
}


//Solo dejar introducir numeros input edad...
miFormulario = document.querySelector('#edad');
miFormulario.addEventListener('keypress', function (e){
	if (!soloNumeros(e)){
    e.preventDefault();
    Toastify({
      text: "Solo permite introducir numeros",
      backgroundColor: "linear-gradient(0deg, rgba(220,54,69,1) 0%, rgba(61,10,15,1) 98%)",
      duration: 3000
      }).showToast();
    
  }
});

function soloNumeros(e){
    var key = e.charCode;
    /* console.log(key); */
    return key >= 48 && key <= 57;
}



//Borrar Usuarios...
function eliminar(id){

  Swal.fire({
    title: '¿Borrar Item?',
    showDenyButton: true,
    icon: 'question',
    showCancelButton: false,
    confirmButtonText: `Si`,
    denyButtonText: `No`,
  }).then((result) => {
    if (result.isConfirmed) {
      db.collection("usuarios").doc(id).delete()
      console.log("Usuario eliminado!");
      resetForm();
      //Reset Text Input
      document.getElementById('filtro').value = "";
      Swal.fire({
        title: 'Usuario borrado correctamente',
        text: "",
        icon: 'success',
        showClass: {
          popup: 'animate__animated animate__backInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__hinge'
        },
        timer: 2000,
        showConfirmButton: false,
      })

    } else if (result.isDenied) {
        Toastify({
            text: "Usuario no borrado",
            backgroundColor: "linear-gradient(0deg, rgba(220,54,69,1) 0%, rgba(61,10,15,1) 98%)",
            duration: 3000
            }).showToast();
    }
  });
  }

//No edit if Inputs content equal
  function isEqual(id) {
  
    var nameForFirebase = document.getElementById(`${id}_nombre`).innerText
    var apellidoForFirebase = document.getElementById(`${id}_apellido`).innerText
    var edadForFirebase = document.getElementById(`${id}_edad`).innerText;

    var nameEdit = document.getElementById('nombre').value;
    var apellidoEdit = document.getElementById('apellido').value;
    var edadEdit = document.getElementById('edad').value;

    if ( nameForFirebase === nameEdit &&
      apellidoForFirebase === apellidoEdit &&
      edadForFirebase === edadEdit) {
      return 1;
    } else {
      return 0;
    }
  }


//Editar solo si hay cambios


/*function checkChanges(e) {
  
} */


/* //evento del teclado en el campo filtro
nombre.addEventListener('keyup', checkChanges);
apellido.addEventListener('keyup', checkChanges);
edad.addEventListener('keyup', checkChanges); */




//Editar Usuarios / Firebase...
function editar(id) {

  /* idEditing = id */
  

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });

  var nameForFirebase = document.getElementById(`${id}_nombre`).innerText
  var apellidoForFirebase = document.getElementById(`${id}_apellido`).innerText
  document.getElementById('nombre').value = nameForFirebase;
  document.getElementById('apellido').value = apellidoForFirebase;
  document.getElementById('edad').value = document.getElementById(`${id}_edad`).innerText;
  
  //var boton = document.getElementById('boton');
  boton.value = "Editar"

  var h1EditUsers = document.querySelector('#titlechange');
  h1EditUsers.textContent = `Editando ${nameForFirebase}, ${apellidoForFirebase}`;


  var buttonCancel = document.querySelector('.cancelar');
  /* console.log(buttonCancel); */
  buttonCancel.classList.remove('no-visible');
  buttonCancel.classList.add('visible');

  Toastify({
    text: `Editando ${nameForFirebase} ${apellidoForFirebase}`,
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    duration: 3000
    }).showToast();

  boton.onclick = function() {
      var washingtonRef = db.collection("usuarios").doc(id);

      if ( inputNull() ) {
        return;
      };

      var nameForFirebase = document.getElementById('nombre').value;
      var apellidoForFirebase = document.getElementById('apellido').value;
      var edadForFirebase = document.getElementById('edad').value;

      if (isEqual(id)) {
        Toastify({
          text: `Editar: sin cambios en ${nameForFirebase} ${apellidoForFirebase}`,
          backgroundColor: "linear-gradient(to right, #007acc, #003D66)",
          duration: 3000
          }).showToast();
        resetForm();
        return
      }
      return washingtonRef.update({
        nombre: nameForFirebase,
        apellido: apellidoForFirebase,
        edad: edadForFirebase
      }).then(function() {
        
        resetForm();

        Swal.fire({
          title: 'Usuario editado correctamente: ',
          text: `Nombre: ${nameForFirebase}` + "\n " + `Apellido: ${apellidoForFirebase}`,
          icon: 'success',
          showClass: {
            popup: 'animate__animated animate__backInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__backOutDown'
          },
          timer: 2000,
          showConfirmButton: false,
        })
        console.log("Usuario editado!");
      }).catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error: ", error);
      });

  }

  
}

//Editar Usuarios / Firebase...
// function editar(id, nameForFirebase, apellidoForFirebase, edadForFirebase) {

//   window.scrollTo({
//     top: 0,
//     left: 0,
//     behavior: 'smooth'
//   });

//   document.getElementById('nombre').value = nameForFirebase;
//   document.getElementById('apellido').value = apellidoForFirebase;
//   document.getElementById('edad').value = edadForFirebase;
//   //var boton = document.getElementById('boton');
//   boton.value = "Editar"

//   var h1EditUsers = document.querySelector('#titlechange');
//   h1EditUsers.textContent = `Editando ${nameForFirebase}, ${apellidoForFirebase}`;


//   var buttonCancel = document.querySelector('.cancelar');
//   /* console.log(buttonCancel); */
//   buttonCancel.classList.remove('no-visible');
//   buttonCancel.classList.add('visible');

//   Toastify({
//     text: `Editando ${nameForFirebase} ${apellidoForFirebase}`,
//     backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
//     duration: 3000
//     }).showToast();

//   boton.onclick = function() {
//       var washingtonRef = db.collection("usuarios").doc(id);

//       if ( inputNull() ) {
//         return;
//       };

//       var nameForFirebase = document.getElementById('nombre').value;
//       var apellidoForFirebase = document.getElementById('apellido').value;
//       var edadForFirebase = document.getElementById('edad').value;

//       return washingtonRef.update({
//         nombre: nameForFirebase,
//         apellido: apellidoForFirebase,
//         edad: edadForFirebase
//       }).then(function() {
        
//         resetForm();

//         Swal.fire({
//           title: 'Usuario editado correctamente: ',
//           text: `Nombre: ${nameForFirebase}` + "\n " + `Apellido: ${apellidoForFirebase}`,
//           icon: 'success',
//           showClass: {
//             popup: 'animate__animated animate__backInDown'
//           },
//           hideClass: {
//             popup: 'animate__animated animate__backOutDown'
//           },
//           timer: 2000,
//           showConfirmButton: false,
//         })
//         console.log("Usuario editado!");
//       }).catch(function(error) {
//       // The document probably doesn't exist.
//       console.error("Error: ", error);
//       });

//   }

// }

//Funcion cancelar Edit
function cancelar() {
  document.getElementById('nombre').value = "";
  document.getElementById('apellido').value = "";
  document.getElementById('edad').value = "";
  boton.value = "Añadir";
  boton.onclick =  function(){agregarItem()};
  var buttonCancel = document.querySelector('.cancelar');
  buttonCancel.classList.add('no-visible');
  buttonCancel.classList.remove('visible');
  var h1EditUsers = document.querySelector('#titlechange');
  h1EditUsers.textContent = 'Agregar Usuarios';
}


//Funcion para filtrar items de la lista de items (tabla)
function filtrarItems(e) {
  var table = document.getElementById('tabla');
  var texto = e.target.value.toLowerCase();
  var row = table.getElementsByTagName('tr');
  var numRow = 0;

  Array.from(row).forEach(function(row){
    numRow++;
    var childRow = row.getElementsByTagName('td');
    var exist = 0;
    
    Array.from(childRow).forEach(function(childRow){
        if ( !childRow.classList.contains("td-delete") && !childRow.classList.contains("td-edit")){
          var rowValue = childRow.textContent;
          if(rowValue.toLowerCase().indexOf(texto) != -1) {
            exist = 1;
          }
          console.log("Row =",numRow,"rowValue = ",rowValue," texto = ",texto," found = ",rowValue.toLowerCase().indexOf(texto) != -1," Exist = ",exist);
        }
    });

    console.log("Exist = ",exist);
    if (!exist) {
      row.style.display = 'none';
    }
    else{
      row.style.display = 'table-row';
    };

  });
}


//Funcion emoji
const closeFace = document.querySelector('.closed');
const openFace = document.querySelector('.open');
const normalFace = document.querySelector('.open2');

//addEventListeners
closeFace.addEventListener('click', () => {
  if(openFace.classList.contains('open')) {
    openFace.classList.add('active');
    closeFace.classList.remove('active');
    normalFace.classList.remove('active');
    
  }
});

openFace.addEventListener('click', () => {
  if(openFace.classList.contains('open')) {
    normalFace.classList.add('active');
    openFace.classList.remove('active');
    closeFace.classList.remove('active');
  }
});

normalFace.addEventListener('click', () => {
  if(openFace.classList.contains('open2' && 'open')) {
    closeFace.classList.add('active');
    normalFace.classList.remove('active');
    openFace.classList.remove('active');
  }
});



/* //Funcion emoji con 5 emojis
const closeFace = document.querySelector('.closed');
const openFace = document.querySelector('.open');
const normalFace = document.querySelector('.open2');
const monkey = document.querySelector('.open3');
const banana = document.querySelector('.open4');

//addEventListeners
closeFace.addEventListener('click', () => {
  if(openFace.classList.contains('open')) {
    openFace.classList.add('active');
    closeFace.classList.remove('active');
    normalFace.classList.remove('active');
    monkey.classList.remove('active');
    
  }
});

openFace.addEventListener('click', () => {
  if(openFace.classList.contains('open')) {
    normalFace.classList.add('active');
    openFace.classList.remove('active');
    closeFace.classList.remove('active');
    monkey.classList.remove('active');
  }
});

normalFace.addEventListener('click', () => {
  if(openFace.classList.contains('open2' && 'open')) {
    monkey.classList.add('active');
    normalFace.classList.remove('active');
    openFace.classList.remove('active');
    closeFace.classList.remove('active');
  }
});

monkey.addEventListener('click', () => {
  if(openFace.classList.contains('open2' && 'open')) {
    banana.classList.add('active');
    normalFace.classList.remove('active');
    openFace.classList.remove('active');
    monkey.classList.remove('active');
  }
});

banana.addEventListener('click', () => {
  if(openFace.classList.contains('open2' && 'open')) {
    closeFace.classList.add('active');
    normalFace.classList.remove('active');
    openFace.classList.remove('active');
    monkey.classList.remove('active');
    banana.classList.remove('active');
  }
}); */
