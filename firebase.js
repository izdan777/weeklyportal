/***********************
 * NAVIGATION LOGIC
 ***********************/
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        navButtons.forEach(btn => btn.classList.remove("active"));
        pages.forEach(page => page.classList.remove("active"));

        button.classList.add("active");
        const pageId = button.dataset.page;
        document.getElementById(pageId).classList.add("active");

        localStorage.setItem("activePage", pageId);
    });
});

// Load last visited page
const savedPage = localStorage.getItem("activePage");
if (savedPage) {
    navButtons.forEach(btn =>
        btn.classList.toggle("active", btn.dataset.page === savedPage)
    );
    pages.forEach(page =>
        page.classList.toggle("active", page.id === savedPage)
    );
}

/***********************
 * CASH PAYMENT MODULE
 ***********************/
let cashData = JSON.parse(localStorage.getItem("cashPayments")) || [];
let selectedIndex = null;
let isEdit = false;

const tableBody = document.getElementById("cashTableBody");
const modal = document.getElementById("cashModal");
const modalTitle = document.getElementById("modalTitle");

const fields = {
    vendor: document.getElementById("vendorName"),
    invoice: document.getElementById("invoice"),
    details: document.getElementById("details"),
    document: document.getElementById("document"),
    postDate: document.getElementById("postDate"),
    currency: document.getElementById("currency"),
    amount: document.getElementById("amount")
};

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
}

function renderTable() {
    tableBody.innerHTML = "";
    selectedIndex = null;

    cashData.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
    <td>${index + 1}</td>
    <td>${item.vendor}</td>
    <td>${item.invoice}</td>
    <td>${item.details}</td>
    <td>${item.document}</td>
    <td>${formatDate(item.postDate)}</td>
    <td>${item.currency}</td>
    <td>${item.amount}</td>
`;

        row.addEventListener("click", () => {
            document.querySelectorAll("#cashTableBody tr")
                .forEach(r => r.classList.remove("selected"));
            row.classList.add("selected");
            selectedIndex = index;
        });

        tableBody.appendChild(row);
    });

    localStorage.setItem("cashPayments", JSON.stringify(cashData));
}

function openModal(editMode = false) {
    isEdit = editMode;
    modalTitle.textContent = editMode ? "Edit Cash Payment" : "Add Cash Payment";
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
    Object.values(fields).forEach(field => field.value = "");
}

/* BUTTON ACTIONS */
document.getElementById("addBtn").addEventListener("click", () => {
    selectedIndex = null;
    openModal(false);
});

document.getElementById("editBtn").addEventListener("click", () => {
    if (selectedIndex === null) {
        alert("Please select a row to edit.");
        return;
    }

    const data = cashData[selectedIndex];
    Object.keys(fields).forEach(key => {
        fields[key].value = data[key];
    });

    openModal(true);
});

document.getElementById("completeBtn").addEventListener("click", () => {
    if (selectedIndex === null) {
        alert("Please select a row to complete.");
        return;
    }

    cashData.splice(selectedIndex, 1);
    renderTable();
});

/* MODAL ACTIONS */
document.getElementById("cancelBtn").addEventListener("click", closeModal);

document.getElementById("submitBtn").addEventListener("click", () => {
    for (let key in fields) {
        if (!fields[key].value) {
            alert("Please fill all fields.");
            return;
        }
    }

    const entry = {};
    Object.keys(fields).forEach(key => {
        entry[key] = fields[key].value;
    });

    if (isEdit) {
        cashData[selectedIndex] = entry;
    } else {
        cashData.push(entry);
    }

    closeModal();
    renderTable();
});

/* INITIAL LOAD */
renderTable();

/***********************
 * VENDOR REQUEST MODULE
 ***********************/
let vendorData = JSON.parse(localStorage.getItem("vendorRequests")) || [];
let vendorSelectedIndex = null;
let vendorIsEdit = false;

const vendorTableBody = document.getElementById("vendorTableBody");
const vendorModal = document.getElementById("vendorModal");
const vendorModalTitle = document.getElementById("vendorModalTitle");

const vendorFields = {
    reqNo: document.getElementById("vendorReqNo"),
    name: document.getElementById("vendorReqName"),
    depositNo: document.getElementById("depositReqNo"),
    date: document.getElementById("vendorReqDate")
};

function renderVendorTable() {
    vendorTableBody.innerHTML = "";
    vendorSelectedIndex = null;

    vendorData.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.reqNo}</td>
            <td>${item.name}</td>
            <td>${item.depositNo}</td>
            <td>${formatDate(item.date)}</td>
        `;

        row.addEventListener("click", () => {
            document.querySelectorAll("#vendorTableBody tr")
                .forEach(r => r.classList.remove("selected"));
            row.classList.add("selected");
            vendorSelectedIndex = index;
        });

        vendorTableBody.appendChild(row);
    });

    localStorage.setItem("vendorRequests", JSON.stringify(vendorData));
}

function openVendorModal(edit = false) {
    vendorIsEdit = edit;
    vendorModalTitle.textContent = edit ? "Edit Vendor Request" : "Add Vendor Request";
    vendorModal.classList.remove("hidden");
}

function closeVendorModal() {
    vendorModal.classList.add("hidden");
    Object.values(vendorFields).forEach(f => f.value = "");
}

/* BUTTON ACTIONS */
document.getElementById("vendorAddBtn").addEventListener("click", () => {
    vendorSelectedIndex = null;
    openVendorModal(false);
});

document.getElementById("vendorEditBtn").addEventListener("click", () => {
    if (vendorSelectedIndex === null) {
        alert("Please select a row to edit.");
        return;
    }

    const data = vendorData[vendorSelectedIndex];
    vendorFields.reqNo.value = data.reqNo;
    vendorFields.name.value = data.name;
    vendorFields.depositNo.value = data.depositNo;
    vendorFields.date.value = data.date;

    openVendorModal(true);
});

document.getElementById("vendorCompleteBtn").addEventListener("click", () => {
    if (vendorSelectedIndex === null) {
        alert("Please select a row to complete.");
        return;
    }

    vendorData.splice(vendorSelectedIndex, 1);
    renderVendorTable();
});

/* MODAL ACTIONS */
document.getElementById("vendorCancelBtn").addEventListener("click", closeVendorModal);

document.getElementById("vendorSubmitBtn").addEventListener("click", () => {
    for (let key in vendorFields) {
        if (!vendorFields[key].value) {
            alert("Please fill all fields.");
            return;
        }
    }

    const entry = {
        reqNo: vendorFields.reqNo.value,
        name: vendorFields.name.value,
        depositNo: vendorFields.depositNo.value,
        date: vendorFields.date.value
    };

    if (vendorIsEdit) {
        vendorData[vendorSelectedIndex] = entry;
    } else {
        vendorData.push(entry);
    }

    closeVendorModal();
    renderVendorTable();
});

/* INITIAL LOAD */
renderVendorTable();

/***********************
 * BANK REQUEST MODULE
 ***********************/
let bankData = JSON.parse(localStorage.getItem("bankRequests")) || [];
let bankSelectedIndex = null;
let bankIsEdit = false;

const bankTableBody = document.getElementById("bankTableBody");
const bankModal = document.getElementById("bankModal");
const bankModalTitle = document.getElementById("bankModalTitle");
const bankSearch = document.getElementById("bankSearch");

const bankFields = {
    ba: document.getElementById("bankBA"),
    bankName: document.getElementById("bankName"),
    invoiceNo: document.getElementById("bankInvoiceNo"),
    invoiceDate: document.getElementById("bankInvoiceDate"),
    amount: document.getElementById("bankAmount"),
    details: document.getElementById("bankDetails"),
    pvNo: document.getElementById("bankPVNo"),
    documentNo: document.getElementById("bankDocumentNo"),
    postDate: document.getElementById("bankPostDate")
};

function renderBankTable(filter = "") {
    bankTableBody.innerHTML = "";
    bankSelectedIndex = null;

    bankData
        .filter(item =>
            Object.values(item).some(val =>
                val.toLowerCase().includes(filter.toLowerCase())
            )
        )
        .forEach((item, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.ba}</td>
                <td>${item.bankName}</td>
                <td>${item.invoiceNo}</td>
                <td>${formatDate(item.invoiceDate)}</td>
                <td>${item.amount}</td>
                <td>${item.details}</td>
                <td>${item.pvNo}</td>
                <td>${item.documentNo}</td>
                <td>${formatDate(item.postDate)}</td>
            `;

            row.addEventListener("click", () => {
                document.querySelectorAll("#bankTableBody tr")
                    .forEach(r => r.classList.remove("selected"));
                row.classList.add("selected");
                bankSelectedIndex = index;
            });

            bankTableBody.appendChild(row);
        });

    localStorage.setItem("bankRequests", JSON.stringify(bankData));
}

function openBankModal(edit = false) {
    bankIsEdit = edit;
    bankModalTitle.textContent = edit ? "Edit Bank Request" : "Add Bank Request";
    bankModal.classList.remove("hidden");
}

function closeBankModal() {
    bankModal.classList.add("hidden");
    Object.values(bankFields).forEach(f => f.value = "");
}

/* BUTTON ACTIONS */
document.getElementById("bankAddBtn").addEventListener("click", () => {
    bankSelectedIndex = null;
    openBankModal(false);
});

document.getElementById("bankEditBtn").addEventListener("click", () => {
    if (bankSelectedIndex === null) {
        alert("Please select a row to edit.");
        return;
    }

    const data = bankData[bankSelectedIndex];
    Object.keys(bankFields).forEach(k => bankFields[k].value = data[k]);

    openBankModal(true);
});

document.getElementById("bankCompleteBtn").addEventListener("click", () => {
    if (bankSelectedIndex === null) {
        alert("Please select a row to complete.");
        return;
    }

    bankData.splice(bankSelectedIndex, 1);
    renderBankTable(bankSearch.value);
});

/* MODAL ACTIONS */
document.getElementById("bankCancelBtn").addEventListener("click", closeBankModal);

document.getElementById("bankSubmitBtn").addEventListener("click", () => {
    for (let key in bankFields) {
        if (!bankFields[key].value) {
            alert("Please fill all fields.");
            return;
        }
    }

    const entry = {};
    Object.keys(bankFields).forEach(k => entry[k] = bankFields[k].value);

    if (bankIsEdit) {
        bankData[bankSelectedIndex] = entry;
    } else {
        bankData.push(entry);
    }

    closeBankModal();
    renderBankTable(bankSearch.value);
});

/* LIVE SEARCH */
bankSearch.addEventListener("input", () => {
    renderBankTable(bankSearch.value);
});

/* INITIAL LOAD */
renderBankTable();

/***********************
 * TO DO LIST MODULE
 ***********************/
let todoData = JSON.parse(localStorage.getItem("todoList")) || [];
let todoSelectedIndex = null;
let todoIsEdit = false;

const todoTableBody = document.getElementById("todoTableBody");
const todoModal = document.getElementById("todoModal");
const todoModalTitle = document.getElementById("todoModalTitle");

const todoFields = {
    date: document.getElementById("todoDate"),
    description: document.getElementById("todoDescription"),
    dueDate: document.getElementById("todoDueDate"),
    dueTime: document.getElementById("todoDueTime"),
    status: document.getElementById("todoStatus")
};

function renderTodoTable() {
    todoTableBody.innerHTML = "";
    todoSelectedIndex = null;

    todoData.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${formatDate(item.date)}</td>
            <td>${item.description}</td>
            <td>${formatDate(item.dueDate)}</td>
            <td>${item.dueTime}</td>
            <td>${item.status}</td>
        `;

        row.addEventListener("click", () => {
            document.querySelectorAll("#todoTableBody tr")
                .forEach(r => r.classList.remove("selected"));
            row.classList.add("selected");
            todoSelectedIndex = index;
        });

        todoTableBody.appendChild(row);
    });

    localStorage.setItem("todoList", JSON.stringify(todoData));
}

function openTodoModal(edit = false) {
    todoIsEdit = edit;
    todoModalTitle.textContent = edit ? "Edit Task" : "Add Task";
    todoModal.classList.remove("hidden");
}

function closeTodoModal() {
    todoModal.classList.add("hidden");
    Object.values(todoFields).forEach(f => f.value = "");
}

/* BUTTON ACTIONS */
document.getElementById("todoAddBtn").addEventListener("click", () => {
    todoSelectedIndex = null;
    openTodoModal(false);
});

document.getElementById("todoEditBtn").addEventListener("click", () => {
    if (todoSelectedIndex === null) {
        alert("Please select a task to edit.");
        return;
    }

    const data = todoData[todoSelectedIndex];
    Object.keys(todoFields).forEach(k => todoFields[k].value = data[k]);

    openTodoModal(true);
});

document.getElementById("todoCompleteBtn").addEventListener("click", () => {
    if (todoSelectedIndex === null) {
        alert("Please select a task to complete.");
        return;
    }

    todoData.splice(todoSelectedIndex, 1);
    renderTodoTable();
});

/* MODAL ACTIONS */
document.getElementById("todoCancelBtn").addEventListener("click", closeTodoModal);

document.getElementById("todoSubmitBtn").addEventListener("click", () => {
    const entry = {};
    Object.keys(todoFields).forEach(k => entry[k] = todoFields[k].value);

    if (todoIsEdit) {
        todoData[todoSelectedIndex] = entry;
    } else {
        todoData.push(entry);
    }

    closeTodoModal();
    renderTodoTable();
});


/* INITIAL LOAD */
renderTodoTable();

/***********************
 * PASSWORDS MODULE
 ***********************/
let passwordData = JSON.parse(localStorage.getItem("passwords")) || [];
let passwordSelectedIndex = null;
let passwordIsEdit = false;

const passwordTableBody = document.getElementById("passwordTableBody");
const passwordModal = document.getElementById("passwordModal");
const passwordModalTitle = document.getElementById("passwordModalTitle");

const passwordFields = {
    name: document.getElementById("passName"),
    system: document.getElementById("passSystem"),
    username: document.getElementById("passUsername"),
    password: document.getElementById("passPassword")
};

function renderPasswordTable() {
    passwordTableBody.innerHTML = "";
    passwordSelectedIndex = null;

    passwordData.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
    <td>${index + 1}</td>
    <td>${item.name}</td>
    <td>${item.system}</td>
    <td>${item.username}</td>
    <td>${item.password}</td>
`;


        row.addEventListener("click", () => {
            document.querySelectorAll("#passwordTableBody tr")
                .forEach(r => r.classList.remove("selected"));
            row.classList.add("selected");
            passwordSelectedIndex = index;
        });

        passwordTableBody.appendChild(row);
    });

    localStorage.setItem("passwords", JSON.stringify(passwordData));
}

function openPasswordModal(edit = false) {
    passwordIsEdit = edit;
    passwordModalTitle.textContent = edit ? "Edit Password" : "Add Password";
    passwordModal.classList.remove("hidden");
}

function closePasswordModal() {
    passwordModal.classList.add("hidden");
    Object.values(passwordFields).forEach(f => f.value = "");
}

/* BUTTON ACTIONS */
document.getElementById("passAddBtn").addEventListener("click", () => {
    passwordSelectedIndex = null;
    openPasswordModal(false);
});

document.getElementById("passEditBtn").addEventListener("click", () => {
    if (passwordSelectedIndex === null) {
        alert("Please select a row to edit.");
        return;
    }

    const data = passwordData[passwordSelectedIndex];
    Object.keys(passwordFields).forEach(k => passwordFields[k].value = data[k]);

    openPasswordModal(true);
});

document.getElementById("passDeleteBtn").addEventListener("click", () => {
    if (passwordSelectedIndex === null) {
        alert("Please select a row to delete.");
        return;
    }

    passwordData.splice(passwordSelectedIndex, 1);
    renderPasswordTable();
});

/* MODAL ACTIONS */
document.getElementById("passwordCancelBtn").addEventListener("click", closePasswordModal);

document.getElementById("passwordSubmitBtn").addEventListener("click", () => {
    const entry = {};
    Object.keys(passwordFields).forEach(k => entry[k] = passwordFields[k].value);

    if (passwordIsEdit) {
        passwordData[passwordSelectedIndex] = entry;
    } else {
        passwordData.push(entry);
    }

    closePasswordModal();
    renderPasswordTable();
});

/* INITIAL LOAD */
renderPasswordTable();
