export const createRepository = (req, res) => {
    res.send("create repo");
};
export const getAllRepositories = (req, res) => {
    res.send("get all repo");
};

export const fetchRepositoryById = (req, res) => {
    res.send("fetched by id");
};
export const fetchRepositoryByName = (req, res) => {
    res.send("fetched by name");
};
export const fetchRepositoriesForCurrentUser = (req, res) => {
    res.send("fetched for curr user");
};

export const updateRepositoryById = (req, res) => {
    res.send("update by id");
};

export const toggleVisibilityById = (req, res) => {
    res.send("toggle");
};

export const deleteRepositoryById = (req, res) => {
    res.send("delete");
};
