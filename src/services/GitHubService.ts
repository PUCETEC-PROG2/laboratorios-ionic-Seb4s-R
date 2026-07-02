import axios from "axios";
import { Repository } from "../interfaces/Repository";
import { GithubUser } from "../interfaces/GithubUser";
import { RepositoryPayload } from "../interfaces/RepositoryPayload";

const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL;
const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

// Configuración del cliente Axios con la URL base y cabeceras de autenticación de GitHub
const githubClient = axios.create({
    baseURL: GITHUB_API_URL,
    headers: {
        Authorization: `Bearer ${GITHUB_API_TOKEN}`,
        Accept: "application/vnd.github.v3+json"
    }
});

/**
 * Helper para formatear los errores de Axios y extraer la respuesta detallada de la API de GitHub.
 * Retorna un objeto de tipo Error que debe ser lanzado con "throw" en el bloque catch.
 */
const handleAxiosError = (error: any, defaultMessage: string): Error => {
    console.error(defaultMessage, error);
    if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        // Si la API de GitHub devolvió un mensaje de error estructurado
        if (responseData && typeof responseData === "object") {
            let message = responseData.message || "";
            // Si hay una lista detallada de errores de validación (común en 422 Unprocessable Entity)
            if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
                const details = responseData.errors
                    .map((err: any) => {
                        if (err.message) return err.message;
                        if (err.field && err.code) return `Campo "${err.field}": ${err.code}`;
                        return err.code || JSON.stringify(err);
                    })
                    .join(", ");
                message = `${message} (${details})`;
            }
            return new Error(message || `Error del servidor (Código ${error.response.status})`);
        }
    }
    return error instanceof Error ? error : new Error(String(error));
};

/**
 * Obtiene la lista de repositorios del usuario autenticado.
 */
export const fetchRepositories = async (): Promise<Repository[]> => {
    try {
        const response = await githubClient.get("/user/repos", {
            params: {
                per_page: 100,
                sort: "created",
                direction: "desc",
                affiliation: "owner",
                t: Date.now() // Bypass de caché de red de GitHub (evita retraso de hasta 20s en actualizaciones)
            }
        });
        return response.data as Repository[];
    } catch (error) {
        throw handleAxiosError(error, "Error al leer los repositorios de GitHub:");
    }
}

/**
 * Crea un nuevo repositorio en la cuenta del usuario autenticado (POST /user/repos).
 */
export const createRepository = async (repository : RepositoryPayload): Promise<Repository> => {
    try {
        const response = await githubClient.post("/user/repos", repository);
        return response.data as Repository;
    } catch (error) {
        throw handleAxiosError(error, "Error al crear repositorio:");
    }
}

/**
 * Obtiene la información del usuario autenticado (GET /user).
 */
export const fetchUserInfo = async (): Promise<GithubUser> => {
    try {
        const response = await githubClient.get("user");
        return response.data as GithubUser;
    } catch (error) {
        throw handleAxiosError(error, "Error al leer usuario:");
    }
}

/**
 * Elimina un repositorio específico (DELETE /repos/{owner}/{repoName}).
 */
export const deleteRepository = async (owner: string, repoName: string): Promise<void> => {
    try {
        await githubClient.delete(`repos/${owner}/${repoName}`);
    } catch (error) {
        throw handleAxiosError(error, "Error al eliminar repositorio:");
    }
};

/**
 * Actualiza la información de un repositorio (PATCH /repos/{owner}/{repoName}).
 */
export const updateRepository = async (owner: string, repoName: string, data: RepositoryPayload): Promise<Repository> => {
    try {
        const response = await githubClient.patch(`repos/${owner}/${repoName}`, data);
        return response.data as Repository;
    } catch (error) {
        throw handleAxiosError(error, "Error al actualizar repositorio:");
    }
};
