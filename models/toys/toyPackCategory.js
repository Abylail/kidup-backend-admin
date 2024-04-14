import {DataTypes} from "sequelize";

const getToyPackCategoryModel = sequelize => {
    const ToyPackCategory = sequelize.define('toyPackСategory', {
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
        icon_mdi: {
            type: DataTypes.STRING,
            allowNull: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return ToyPackCategory
}

export default getToyPackCategoryModel