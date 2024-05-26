import {DataTypes} from "sequelize";

const getAnnouncementCategoryModel = sequelize => {
    const AnnouncementCategory = sequelize.define('announcementCategory', {
        name_ru: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name_kz: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        icon_mdi: {
            type: DataTypes.STRING,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })


    AnnouncementCategory.associate = models => {
        models.AnnouncementCategory.belongsToMany(models.Announcement, {
            through: "announcement_category",
            as: "announcements"
        });
    }

    return AnnouncementCategory
}

export default getAnnouncementCategoryModel;