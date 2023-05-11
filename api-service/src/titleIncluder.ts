export function titleIncluder(arr: string[]): string[] {
    let result: string[] = [...arr];
    if(arr.includes("Programmer")){
        result = result.concat(["developer", "engineer", "software"])
    }
    if(arr.includes("Data")){
        result = result.concat([])
    }
    if(arr.includes("Network")){
        result = result.concat(["Jaringan"])
    }
    if(arr.includes("Security")){
        result = result.concat(["hacker"])
    }
    return result 
}