import {DataTypes} from "sequelize";
import "dotenv/config"

const getAnnouncementModel = sequelize => {
    const Announcement = sequelize.define('announcement', {
        photos: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING,
            required: true
        },
        description: DataTypes.STRING,
        use_experience: DataTypes.STRING,
        brand: DataTypes.STRING,
        price: DataTypes.INTEGER,
        status: {
            type: DataTypes.STRING,
            values: ["draft", "moderation", "rejected", "active", "waitingPayment", "ordered", "archive"]
        },
        reject_reason: DataTypes.STRING,
        max_age: {
            type: DataTypes.INTEGER,
            default: 96
        },
        min_age: {
            type: DataTypes.INTEGER,
            default: 0
        },
        condition: {
            type: DataTypes.INTEGER,
        },
        sell_date: DataTypes.DATE,
        express_delivery: {
            type: DataTypes.BOOLEAN,
            default: false
        }
    })

    Announcement.associate = models => {
        models.Announcement.belongsToMany(models.AnnouncementCategory, {through: "announcement_category", as: "categories"});
        models.Announcement.belongsTo(models.Parent, {foreignKey: "seller_id"});
        models.Announcement.belongsTo(models.Parent, {foreignKey: "buyer_id"});
    }

    return Announcement;
}

export default getAnnouncementModel;