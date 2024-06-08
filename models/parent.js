import {DataTypes} from "sequelize";
import "dotenv/config"

const getParentModel = sequelize => {
    const Parent = sequelize.define('parent', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        phone: {
            type: DataTypes.STRING,
            unique: false
        },
        bonuses: {
            type: DataTypes.INTEGER,
            default: 0
        },
        address: DataTypes.STRING,
        favorite_ids: DataTypes.JSON,
        cart: DataTypes.JSON
    })

    return Parent;
}

export default getParentModel