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

export const uploadFiles = createAsyncThunk(
  "upload/files/assign",
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
export const showMoreTicket = createAsyncThunk(
  "showMore/tickets/assign",
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
export const update = createAsyncThunk(
  "update/ticket/assign",
  async ({ ticketId, newTicket }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/ticket/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
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
export const updateImage = createAsyncThunk(
  "updat/ticketImage",
  async (data, rejectWithValue) => {
    try {
      const response = await fetch(`/api/v1/ticket/updateImage`, {
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
export const searchTicket = createAsyncThunk(
  "search/tickets",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/ticket/getTickets?${data}`);
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

export const closeTicket = createAsyncThunk(
  "close/ticket",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/ticket/${data}/cqr`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTicket = createAsyncThunk(
  "get/ticket",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/ticket/${data}`);
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

export const cancelTicket = createAsyncThunk(
  "cancel/ticket",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/ticket/cancel/${data}`);
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

export const incPrintCount = createAsyncThunk(
  "inc/printcount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/ticket/print/${data}`);
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

export const reschedule = createAsyncThunk(
  "reschedule",
  async (data, { rejectWithValue }) => {
    try {
      const { id, changes } = data;
      const response = await fetch(`/api/v1/ticket/reschedule/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
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

export const assignerSlice = createSlice({
  name: "assigner",
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
    updateManagerField: (state, action) => {
      const { field, value } = action.payload;
      state.newTicket[field] = value;
    },
    getIt: (state, action) => {
      const { ticketId } = action.payload;
      state.newTicket = state.tickets.find((ticket) => ticket._id === ticketId);
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
    setImageLinkOfTicketNo: (state, action) => {
      state.tickets = state.tickets.map((ticket) => {
        if (ticket.ticketNo === action.payload.ticketNo) {
          return { ...ticket, ticketImage: action.payload.link };
        } else {
          return ticket;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(searchTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchTicket.fulfilled, (state, { payload }) => {
        state.tickets = payload.tickets;
        state.loading = false;
        state.todayTickets = payload.todayTickets;
        state.totalTickets = payload.totalTickets;
        if (payload.tickets.length < 9) {
          state.showMore = false;
        } else {
          state.showMore = true;
        }
      })
      .addCase(searchTicket.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })
      .addCase(update.pending, (state) => {
        state.loading = true;
      })
      .addCase(update.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tickets = state.tickets.filter(
          (ticket) => ticket._id !== payload.ticket._id
        );
        state.tickets.push(payload.ticket);
        state.tickets = state.tickets.sort((a, b) => b.ticketNo - a.ticketNo);
        state.newTicket = initialState.newTicket;
        toast.success(payload.message);
      })
      .addCase(update.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.message);
      })
      .addCase(incPrintCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(incPrintCount.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tickets = state.tickets.filter(
          (ticket) => ticket._id !== payload.ticket._id
        );
        state.tickets.push(payload.ticket);
        state.tickets = state.tickets.sort((a, b) => b.ticketNo - a.ticketNo);
        state.newTicket = payload.ticket;
        toast.success(payload.message);
      })
      .addCase(incPrintCount.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.message);
      })
      .addCase(closeTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(closeTicket.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tickets = state.tickets.filter(
          (ticket) => ticket._id !== payload.ticket._id
        );
        state.tickets.push(payload.ticket);
        state.tickets = state.tickets.sort((a, b) => b.ticketNo - a.ticketNo);
        toast.success(payload.message);
      })
      .addCase(closeTicket.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.message);
      })
      .addCase(reschedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(reschedule.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tickets = state.tickets.filter(
          (ticket) => ticket._id !== payload.ticket._id
        );
        state.tickets.push(payload.ticket);
        state.tickets = state.tickets.sort((a, b) => b.ticketNo - a.ticketNo);
        toast.success(payload.message);
      })
      .addCase(reschedule.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.message);
      })
      .addCase(updateImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateImage.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tickets = state.tickets.filter(
          (ticket) => ticket._id !== payload.ticket._id
        );
        state.tickets.push(payload.ticket);
        state.tickets = state.tickets.sort((a, b) => b.ticketNo - a.ticketNo);
        toast.success(payload.message);
      })
      .addCase(updateImage.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.message);
      })
      .addCase(cancelTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelTicket.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tickets = state.tickets.filter(
          (ticket) => ticket._id !== payload.ticket._id
        );
        state.tickets.push(payload.ticket);
        state.tickets = state.tickets.sort((a, b) => b.ticketNo - a.ticketNo);
        state.newTicket = initialState.newTicket;
        toast.success(payload.message);
      })
      .addCase(cancelTicket.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.message);
      });
  },
});

export const {
  updateIssueField,
  handleMode,
  handlePhoneFilds,
  handleInspection,
  updateManagerField,
  getIt,
  setCreator,
  setTickets,
  setSelectedService,
  setImageLinkOfTicketNo,
} = assignerSlice.actions;
export default assignerSlice.reducer;
