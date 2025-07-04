
export const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) return res.status(400).json({message: "No token found at request auth headers"}); 

        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(400).json({message: "Invalid token format"}); 

        const secret = process.env.JWT_SECRET;
        const validation = await jwt.verify(token, secret); 
        if (!validation) return res.status(401).json({message: "Unauthorized acces, invalid token"}); 
        if(!validation.dni) return res.status(400).json({message: "Token must at least have an id provided"}); 
        
        req.dni = validation.dni;          

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    
    next();
}; 