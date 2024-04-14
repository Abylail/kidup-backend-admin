import {DataTypes} from "sequelize";

const getToyPackModel = sequelize => {
    const ToyPack = sequelize.define('toyPack', {
        name_ru: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name_kz: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description_ru: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description_kz: {
            type: DataTypes.STRING,
            allowNull: false
        },
        list: {
            type: DataTypes.JSON,
        },
    })

    return ToyPack
}

export default getToyPackModel