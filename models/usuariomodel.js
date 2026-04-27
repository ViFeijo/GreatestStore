//uso de postgresql

let usuarios = [];
let nextId = 1;

function salvar(usuario) {
  usuarios.push(usuario);
}

function buscarTodos() {
  return usuarios;
}

function buscarPorId(id) {
  return usuarios.find(u => u.id === id);
}

function buscarPorEmail(email) {
  return usuarios.find(u => u.email === email);
}

function atualizar(index, dados) {
  usuarios[index] = {...usuarios[index], ...dados};
  return usuarios[index];
}

function buscarIndex(id) {
  return usuarios.findIndex(u => u.id === id);
}

function deletar(index) {
  usuarios.splice(index, 1);
}

function gerarId() {
  return nextId++;
}

module.exports = { salvar, buscarTodos, buscarPorId, buscarPorEmail, atualizar, buscarIndex, deletar, gerarId };