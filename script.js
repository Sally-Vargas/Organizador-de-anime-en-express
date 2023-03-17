const $d = document;
const $table = $d.querySelector(".crud-table");
const $form = $d.querySelector(".crud-form");
const $title = $d.querySelector(".crud-title");
const $template = document.getElementById("crud-template").content;
const $fragment = $d.createDocumentFragment();

const getAll = async () => {
    try {
        let respuesta = await axios.get("http://localhost:4000/animes");
        let json = await respuesta.data;
        json.forEach(element => {
            $template.querySelector(".name").textContent = element.nombre;
            $template.querySelector(".capitulos").textContent = element.capitulos;
            $template.querySelector(".edit").dataset.id = element.id;
            $template.querySelector(".edit").dataset.name = element.nombre;
            $template.querySelector(".edit").dataset.capitulos = element.capitulos;
            $template.querySelector(".delete").dataset.id = element.id;

            let $clone = $d.importNode($template, true);

            $fragment.appendChild($clone);
        });

        $table.querySelector("tbody").appendChild($fragment);
    } catch (error) {
        let mensaje = error.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML("afterend",`Error: ${error.status}: ${mensaje}`);
    }
}

$d.addEventListener("DOMContentLoaded", getAll);
$d.addEventListener("submit", async e => {
    if (e.target === $form) {
        e.preventDefault();
//Para agregar nuevos datos
        if (!e.target.id.value) {
            try {
                let opciones = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    data: JSON.stringify({
                        nombre: e.target.nombre.value,
                        capitulos: e.target.capitulos.value
                    })
                };

                let respuesta = await axios("http://localhost:4000/animes", opciones);
                let json = await respuesta.data;

                location.reload();
            } catch (error) {
                let mensaje = error.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend",`Error: ${error.status}: ${mensaje}`);
            }
//Para el boton de editar
        } else {
            try {
                let opciones = {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    data: JSON.stringify({
                        nombre: e.target.nombre.value,
                        capitulos: e.target.capitulos.value
                    })
                };

                let respuesta = await axios(`http://localhost:4000/animes/${e.target.id.value}`, opciones);
                let json = await respuesta.data;

                location.reload();
            } catch (error) {
                let mensaje = error.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend",`Error: ${error.status}: ${mensaje}`);
            }
        }
    }
})
//Para que solo detecte el click en el boton de editar
$d.addEventListener("click", async e => {
    if (e.target.matches(".edit")) {
        $title.textContent = "Editar anime";
        $form.nombre.value = e.target.dataset.name;
        $form.capitulos.value = e.target.dataset.capitulos;
        $form.id.value = e.target.dataset.id;
    }
// Para eliminar un elemento
    if (e.target.matches(".delete")) {
        let confirmacion = confirm("¿Estás seguro de eliminar el elemento seleccionado?")

        if (confirmacion) {
            try {
                let opciones = {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    }
                };

                let respuesta = await axios(`http://localhost:4000/animes/${e.target.dataset.id}`, opciones);
                let json = await respuesta.data;

                location.reload();
            } catch (error) {
                
                let mensaje = error.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend",`Error: ${error.status}: ${mensaje}`);
            }
        }
    }
})
