import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  tickets: [],
  totalTickets: "",
  todayTickets: "",
  loading: false,
  showMore: true,
  services: [],
  newTicket: {
    _id: "",
    contract: {
      number: "",
      billToName: "",
      billToAddress: "",
      billToEmails: [],
      shipToName: "",
      shipToAddress: "",
      shipToEmails: [],
      selectedServices: [],
    },
    complainMode: "email",
    modeDetails: {
      email: {
        emailCopy: "",
      },
      phone: {
        date: "",
        number: "",
        callerDetails: "",
      },
      inspection: {
        inspector: "",
        assessment: "",
        images: [],
      },
    },
    issue: {
      problem: "",
      location: "",
      details: "",
    },
    createdBy: "",
    agent: "",
    scheduledTime: "",
    scheduledDate: "",
    resource: "",
    printcount: 0,
    ticketImage: "",
  },
};

export const contractDetails = createAsyncThunk(
  "cqr/contractDetails",
  async (search, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://cqr.sat9.in/api/contractServices?search=${search}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.msg);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const uploadFiles = createAsyncThunk(
  "upload/files",
  async (data, { rejectWithValue }) => {
    try {
      const { file, name } = data;
      const images = Array.from(file);
      const form = new FormData();
      images.forEach((img) => {
        form.append("images", img);
      });

      const response = await fetch("/api/v1/upload", {
        method: "POST",
        body: form,
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      result.name = name;
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
export const createTicket = createAsyncThunk(
  "create/ticket",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/ticket/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const showMoreTicket = createAsyncThunk(
  "showMore/tickets",
  async ({ startIndex, extraQuery = "" }, { rejectWithValue }) => {
    try {
      let url = `/api/v1/ticket/getTickets?startIndex=${startIndex}`;
      if (extraQuery) {
        url += `&${extraQuery}`;
      }
      const response = await fetch(url);
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const getTickets = createAsyncThunk(
  "get/tickets",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/ticket/getTickets");
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getStatusCount = createAsyncThunk(
  "get/statusCount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/ticket/stats/ticketStatusCounts");
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const getMonthlyStatusCount = createAsyncThunk(
  "get/statusMonthlyCount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/ticket/stats/getMonthlyStat");
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getInsectsCount = createAsyncThunk(
  "get/insectsCount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/ticket/stats/insectsCount");
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const getServiceCount = createAsyncThunk(
  "get/serviceCount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/ticket/stats/serviceCount");
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const getStatusAvg = createAsyncThunk(
  "get/statusAvg",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/ticket/stats/statusAvg");
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getJobs = createAsyncThunk(
  "get/jobs",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/ticket/reports/jobs");
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const createrSlice = createSlice({
  name: "creater",
  initialState,
  reducers: {
    updateIssueField: (state, action) => {
      const { field, value } = action.payload;
      state.newTicket.issue[field] = value;
    },
    handleMode: (state, action) => {
      state.newTicket.complainMode = action.payload;
      state.newTicket.modeDetails = {
        email: {
          emailCopy: "",
        },
        phone: {
          date: "",
          number: "",
          callerDetails: "",
        },
        inspection: {
          inspector: "",
          assessment: "",
          images: [],
        },
      };
    },
    handlePhoneFilds: (state, action) => {
      const { field, value } = action.payload;
      state.newTicket.modeDetails.phone[field] = value;
    },
    handleInspection: (state, action) => {
      const { field, value } = action.payload;
      state.newTicket.modeDetails.inspection[field] = value;
    },
    setTickets: (state, action) => {
      const newData = [...state.tickets, ...action.payload];
      state.tickets = newData;
    },
    setCreator: (state, action) => {
      state.newTicket.createdBy = action.payload;
    },
    setSelectedService: (state, action) => {
      const existingObj = state.newTicket.contract.selectedServices.find(
        (service) =>
          service.name === action.payload.name &&
          service.serviceId === action.payload.serviceId
      );
      if (existingObj) {
        state.newTicket.contract.selectedServices =
          state.newTicket.contract.selectedServices.filter(
            (service) =>
              !(
                service.name === action.payload.name &&
                service.serviceId === action.payload.serviceId
              )
          );
      } else {
        state.newTicket.contract.selectedServices.push(action.payload);
      }
    },
    setInit: (state) => {
      state.newTicket = initialState.newTicket;
      state.services = initialState.services;
      state.loading = initialState.loading;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(contractDetails.pending, (state) => {
        state.loading = true;
        state.newTicket.contract = initialState.newTicket.contract;
      })
      .addCase(contractDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.newTicket.contract.number = payload.details.number;
        state.newTicket.contract.billToName = payload.details.billToName;
        state.newTicket.contract.billToAddress = payload.details.billToAddress;
        state.newTicket.contract.billToEmails = payload.details.shipToEmails;
        state.newTicket.contract.shipToName = payload.details.shipToName;
        state.newTicket.contract.shipToAddress = payload.details.shipToAddress;
        state.newTicket.contract.shipToEmails = payload.details.shipToEmails;
        state.services = payload.services;
      })
      .addCase(contractDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.newTicket = initialState.newTicket;
        toast.error(payload);
      })
      .addCase(uploadFiles.pending, (state) => {
        state.loading = true;
        state.newTicket.modeDetails.email.emailCopy = "";
      })
      .addCase(uploadFiles.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload.name === "email") {
          state.newTicket.modeDetails.email.emailCopy = payload.link;
        }
        if (payload.name === "inspection") {
          state.newTicket.modeDetails.inspection.images.push(payload.link);
        }
        if (payload.name === "ticketImage") {
          state.newTicket.ticketImage = payload.link;
        }
        toast.success(payload.message);
      })
      .addCase(uploadFiles.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTicket.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tickets.push(payload.ticket);
        state.tickets = state.tickets.sort((a, b) => b.ticketNo - a.ticketNo);
        state.newTicket = initialState.newTicket;
        state.services = initialState.services;
        state.todayTickets = state.todayTickets + 1;
        state.totalTickets = state.totalTickets + 1;
        toast.success(payload.message);
      })
      .addCase(createTicket.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.message);
      })
      .addCase(showMoreTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(showMoreTicket.fulfilled, (state, { payload }) => {
        const newData = [...state.tickets, ...payload.tickets];
        state.loading = false;
        state.tickets = newData;
        if (payload.tickets.length < 9) {
          state.showMore = false;
        } else {
          state.showMore = true;
        }
      })
      .addCase(showMoreTicket.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })
      .addCase(getTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTickets.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tickets = payload.tickets;
        state.todayTickets = payload.todayTickets;
        state.totalTickets = payload.totalTickets;
      })
      .addCase(getTickets.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      });
  },
});

export const {
  updateIssueField,
  handleMode,
  handlePhoneFilds,
  handleInspection,
  setCreator,
  setSelectedService,
  setInit,
} = createrSlice.actions;

export default createrSlice.reducer;
