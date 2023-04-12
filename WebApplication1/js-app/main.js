const url = "https://localhost:5001/api/beanvariety/";

const button = document.querySelector("#run-button");
button.addEventListener("click", () => {
  getAllBeanVarieties().then((beans) => {
    beans.map((bean) => {
      const newDiv = document.createElement("div");

      const newContent = document.createTextNode(`${bean.name}`);

      newDiv.appendChild(newContent);

      const currentDiv = document.getElementById("coffee");
      document.body.insertBefore(newDiv, currentDiv);
    });
  });
});

function getAllBeanVarieties() {
  return fetch(url).then((resp) => resp.json());
}

const mainContainer = document.querySelector("#coffee");
const addButton = document.querySelector("#open-form");

addButton.addEventListener("click", () => {
  getAllBeanVarieties().then(() => {
    mainContainer.innerHTML = FormToAddBean();
  });
});

const FormToAddBean = () => {
  return `<form>
            <div class="field">
                <input id="name" type="text" name="name" placeholder="Name">
            </div>
            <div class="field">
                <input id="region" type="text" name="region" placeholder="Region">
            </div>
            <div class="field">
                <input id="notes" type="text" name="notes" placeholder="Notes">
            </div>
            <div class="field">
                <button id="addBean">Add Bean</button>
            </div>
            </form>
            `;
};

function addBeanToDatabase(newBean) {
  const postOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBean),
  };
  return fetch(url, postOptions).then((response) => response.json());
}

mainContainer.addEventListener("click", (clickEvent) => {
  if (clickEvent.target.id === "addBean") {
    clickEvent.preventDefault;
    const nameEntered = document.querySelector("input[name='name']").value;
    const regionEntered = document.querySelector("input[name='region']").value;
    const notesEntered = document.querySelector("input[name='notes']").value;

    const dataToSend = {
      name: nameEntered,
      region: regionEntered,
      notes: notesEntered,
    };

    addBeanToDatabase(dataToSend);
  }
});

mainContainer.addEventListener("click", (clickEvent) => {
  if (clickEvent.target.id === "edit-form") {
    getAllBeanVarieties().then((beans) => {
      mainContainer.innerHTML = editBeanList(beans);
    });
  }
});
const editBeanList = (beans) => {
  let htmlString = "";

  htmlString = beans
    .map((bean) => {
      return `<div>${bean.name}
        <button id="edit" value="${bean.id}">Edit</button>
        </div>`;
    })
    .join("");

  return htmlString;
};

const FormToEditBean = (bean) => {
  return `<form>
            <div class="field">
                <input id="${bean.id}" type="hidden" name="id" value="${bean.id}">
            </div>
            <div class="field">
                <input id="${bean.name}" type="text" name="name" value="${bean.name}">
            </div>
            <div class="field">
                <input id="${bean.region}" type="text" name="region" value="${bean.region}">
            </div>
            <div class="field">
                <input id="${bean.notes}" type="text" name="notes" value="${bean.notes}">
            </div>
            <div class="field">
                <button id="editBean" type="submit">Submit</button>
            </div>
            </form>
            `;
};

function getSelectedBean(id) {
  return fetch(`${url}${id}`).then((resp) => resp.json());
}

mainContainer.addEventListener("click", (clickEvent) => {
  if (clickEvent.target.id == "edit") {
    const beanId = clickEvent.target.value;
    getSelectedBean(beanId).then((bean) => {
      mainContainer.innerHTML = FormToEditBean(bean);
    });
  }
});
function editBean(editBean) {
  const putOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editBean),
  };
  return fetch(`${url}${editBean.id}`, putOptions).then((response) =>
    response.json()
  );
}

mainContainer.addEventListener("click", (clickEvent) => {
  if (clickEvent.target.id === "editBean") {
    const beanId = document.querySelector("input[name='id']").value;
    const nameEntered = document.querySelector("input[name='name']").value;
    const regionEntered = document.querySelector("input[name='region']").value;
    const notesEntered = document.querySelector("input[name='notes']").value;

    const beanToEdit = {
      id: beanId,
      name: nameEntered,
      region: regionEntered,
      notes: notesEntered,
    };

    editBean(beanToEdit);
  }
});

mainContainer.addEventListener("click", (clickEvent) => {
  if (clickEvent.target.id === "delete-form") {
    getAllBeanVarieties().then((beans) => {
      mainContainer.innerHTML = deleteBeanList(beans);
    });
  }
});
const deleteBeanList = (beans) => {
  let htmlString = "";

  htmlString = beans
    .map((bean) => {
      return `<div>${bean.name}
        <button id="delete" value="${bean.id}">Delete</button>
        </div>`;
    })
    .join("");

  return htmlString;
};
const beanDetailsBeforeDelete = (bean) => {
  return `
            <h3>Are you sure you want to delete this bean?</h3>
            <div>
            <input id="${bean.id}" type="hidden" name="id" value="${bean.id}">
            </input>
            <div id="${bean.name}" name="name" value="${bean.name}">
            ${bean.name}
            </div>
            <div id="${bean.region}" name="region" value="${bean.region}">
            ${bean.region}
            </div>
            <div id="${bean.notes}" name="notes" value="${bean.notes}">
            ${bean.notes}
            </div>
            <div class="field">
                <button id="deleteBean" type="submit">Confirm</button>
            </div>
            `;
};

mainContainer.addEventListener("click", (clickEvent) => {
  if (clickEvent.target.id == "delete") {
    const beanId = clickEvent.target.value;
    getSelectedBean(beanId).then((bean) => {
      mainContainer.innerHTML = beanDetailsBeforeDelete(bean);
    });
  }
});

function deleteBean(beanId) {
  return fetch(`${url}${beanId}`, { method: "DELETE" }).then((response) =>
    response.json()
  );
}

mainContainer.addEventListener("click", (clickEvent) => {
  if (clickEvent.target.id === "deleteBean") {
    const beanId = document.querySelector("input[name='id']").value;

    deleteBean(beanId);
  }
});
