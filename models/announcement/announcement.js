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
        description: DataTypes.TEXT,
        use_experience: DataTypes.TEXT,
        brand: DataTypes.STRING,
        price: DataTypes.INTEGER,
        delivery_price: {
            type: DataTypes.INTEGER,
            defaultValue: 2000
        },
        shopPrice: DataTypes.INTEGER,
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
        },
        need_disinfected: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        city: {
            type: DataTypes.STRING,
            default: "almaty"
        },
        tag: {
            type: DataTypes.STRING,
        }
    })

    Announcement.associate = models => {
        models.Announcement.belongsToMany(models.AnnouncementCategory, {through: "announcement_category", as: "categories"});
        models.Announcement.belongsTo(models.Parent, {foreignKey: "seller_id", as: "seller"});
        models.Announcement.belongsTo(models.Parent, {foreignKey: "buyer_id", as: "buyer"});
    }

    return Announcement;
}

export default getAnnouncementModel;