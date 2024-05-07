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
        }
    })

    return Parent;
}

export default getParentModel