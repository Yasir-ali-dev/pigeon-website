import bcrypt from "bcryptjs";

export const hashpassword = async (password) => {
    try {
        const saltrounds=10;
        const hashpassword = await bcrypt.hash(password,saltrounds);
        return hashpassword
    } catch (error) {
        console.log(error)
    }
}


export const comparepassword = async (password,hashpassword) => {
    return bcrypt.compare(password,hashpassword);
};