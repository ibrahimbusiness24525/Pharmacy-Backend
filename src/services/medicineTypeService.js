import MedicineType from "../models/MedicineType.js";

export const getAllMedicineTypes = async () => {
  try {
    const medicineTypes = await MedicineType.find().sort({ createdAt: -1 });
    return medicineTypes;
  } catch (error) {
    throw error;
  }
};


export const updateMedicineType = async (id, data) => {
  try {
    const { companyName, type } = data;

    if (!companyName || !type) {
      throw new Error("Company name and type are required");
    }

    // Validate type-specific fields
    let medicineTypeData = {
      companyName: companyName.trim(),
      type,
    };

    switch (type) {
      case "syp":
        if (!data.sypName || !data.ml) {
          throw new Error("Syp name and ml are required for syp type");
        }
        medicineTypeData.productName = data.sypName.trim();
        medicineTypeData.ml = data.ml.trim();
        break;

      case "tablet":
        if (!data.tabName || !data.gram) {
          throw new Error("Tab name and gram are required for tablet type");
        }
        medicineTypeData.productName = data.tabName.trim();
        medicineTypeData.gram = data.gram.trim();
        break;

      case "skin-care":
        if (!data.productName || !data.creamOrLotion || !data.unit) {
          throw new Error(
            "Product name, cream/lotion selection, and unit are required for skin-care type"
          );
        }
        medicineTypeData.productName = data.productName.trim();
        medicineTypeData.creamOrLotion = data.creamOrLotion;
        medicineTypeData.unit = data.unit;
        break;

      case "hair":
        if (!data.productName || !data.ml) {
          throw new Error("Product name and ml are required for hair type");
        }
        medicineTypeData.productName = data.productName.trim();
        medicineTypeData.ml = data.ml.trim();
        break;

      case "drip":
        if (!data.productName) {
          throw new Error("Product name is required for drip type");
        }
        medicineTypeData.productName = data.productName.trim();
        if (data.ml) {
          medicineTypeData.ml = data.ml.trim();
        }
        if (data.dripDetails) {
          medicineTypeData.dripDetails = data.dripDetails.trim();
        }
        break;

      case "injections":
        if (!data.productName) {
          throw new Error("Product name is required for injections type");
        }
        medicineTypeData.productName = data.productName.trim();
        if (data.ml) {
          medicineTypeData.ml = data.ml.trim();
        }
        break;

      default:
        throw new Error("Invalid medicine type");
    }

    const medicineType = await MedicineType.findByIdAndUpdate(
      id,
      medicineTypeData,
      { new: true, runValidators: true }
    );

    if (!medicineType) {
      throw new Error("Medicine type not found");
    }

    return medicineType;
  } catch (error) {
    throw error;
  }
};

export const deleteMedicineType = async (id) => {
  try {
    const medicineType = await MedicineType.findByIdAndDelete(id);
    if (!medicineType) {
      throw new Error("Medicine type not found");
    }
    return medicineType;
  } catch (error) {
    throw error;
  }
};

export const createMedicineType = async (data) => {
  try {
    // Validate required fields based on type
    const { companyName, type } = data;

    if (!companyName || !type) {
      throw new Error("Company name and type are required");
    }

    // Validate type-specific fields
    let medicineTypeData = {
      companyName: companyName.trim(),
      type,
    };

    switch (type) {
      case "syp":
        if (!data.sypName || !data.ml) {
          throw new Error("Syp name and ml are required for syp type");
        }
        medicineTypeData.productName = data.sypName.trim();
        medicineTypeData.ml = data.ml.trim();
        break;

      case "tablet":
        if (!data.tabName || !data.gram) {
          throw new Error("Tab name and gram are required for tablet type");
        }
        medicineTypeData.productName = data.tabName.trim();
        medicineTypeData.gram = data.gram.trim();
        break;

      case "skin-care":
        if (!data.productName || !data.creamOrLotion || !data.unit) {
          throw new Error(
            "Product name, cream/lotion selection, and unit are required for skin-care type"
          );
        }
        medicineTypeData.productName = data.productName.trim();
        medicineTypeData.creamOrLotion = data.creamOrLotion;
        medicineTypeData.unit = data.unit;
        break;

      case "hair":
        if (!data.productName || !data.ml) {
          throw new Error("Product name and ml are required for hair type");
        }
        medicineTypeData.productName = data.productName.trim();
        medicineTypeData.ml = data.ml.trim();
        break;

      case "drip":
        if (!data.productName) {
          throw new Error("Product name is required for drip type");
        }
        medicineTypeData.productName = data.productName.trim();
        if (data.ml) {
          medicineTypeData.ml = data.ml.trim();
        }
        if (data.dripDetails) {
          medicineTypeData.dripDetails = data.dripDetails.trim();
        }
        break;

      case "injections":
        if (!data.productName) {
          throw new Error("Product name is required for injections type");
        }
        medicineTypeData.productName = data.productName.trim();
        if (data.ml) {
          medicineTypeData.ml = data.ml.trim();
        }
        break;

      default:
        throw new Error("Invalid medicine type");
    }

    const medicineType = await MedicineType.create(medicineTypeData);
    return medicineType;
  } catch (error) {
    throw error;
  }
};

