import axios from "axios";

const baseUrl = "/api/persons";

/* if resolved a promise is returned that contains the response.data Using promise chaining*/
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => {
    return response.data;
  });
};
const create = (newPersonObject) => {
  const request = axios.post(baseUrl, newPersonObject);

  return request.then((response) => {
    return response.data;
  });
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const editNumber = (id, newPersonObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newPersonObject);
  return request.then((response) => {
    return response.data;
  });
};

export default { getAll, create, deletePerson, editNumber };
