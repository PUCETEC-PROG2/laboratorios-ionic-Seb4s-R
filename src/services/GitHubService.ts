import axios from "axios";
import { Repository } from "../interfaces/Repository";
import { GithubUser } from "../interfaces/GithubUser";
import { RepositoryPayload } from "../interfaces/RepositoryPayload";

const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL;
const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

const githubClient = axios.create({
    baseURL: GITHUB_API_URL,
    headers: {
        Authorization: `Bearer ${GITHUB_API_TOKEN}`,
        Accept: "application/vnd.github.v3+json"
    }
});

export const fetchRepositories = async (): Promise<Repository[]> => {
    try {
        const response = await githubClient.get("/user/repos", {
            params: {
                per_page: 100,
                sort: "created",
                direction: "desc",
                affiliation: "owner"
            }
        });
        return response.data as Repository[];
    } catch (error) {
        console.error("Error al leer los repositorios de Github:", error);
        throw new Error (`${(error as Error).message}`)
    }
}

export const createRepository = async (repository : RepositoryPayload): Promise<Repository> => {
    try {
        const response = await githubClient.post("/user/repos", repository);
        return response.data as Repository
    } catch (error) {
        console.error("Error al crear repositorio. ", error);
        throw new Error (`${(error as Error).message}`)
    }
}


export const fetchUserInfo = async (): Promise<GithubUser> => {
    try {
        const response = await githubClient.get("user");
        return response.data as GithubUser
    }catch (error) {
        console.error("Error al leer usuario. ", error);
        throw new Error(`${(error as Error).message}`)
    }
}

// < >