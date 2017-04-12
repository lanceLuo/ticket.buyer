# -*- coding:utf-8
import wx
import wx.grid as gridlib
import datetime


class SimpleGrid(gridlib.Grid):
    data_row = 0

    def __init__(self, parent, data):
        gridlib.Grid.__init__(self, parent, -1, size=(960, 290))
        self.grid_data = data
        self.moveTo = None
        self.Bind(wx.EVT_IDLE, self.OnIdle)
        self.SetRowLabelSize(30)
        self.CreateGrid(10, 6)
        self.set_read_only()
        # simple cell formatting
        self.SetColSize(0, 90)
        self.SetColSize(1, 120)
        self.SetColSize(2, 200)
        self.SetColSize(3, 60)
        self.SetColSize(4, 80)
        self.SetColSize(5, 360)
        self.SetColLabelValue(0, u"帐号")
        self.SetColLabelValue(1, u"账号状态")
        self.SetColLabelValue(2, u"购票状态")
        self.SetColLabelValue(3, u"购票次数")
        self.SetColLabelValue(4, u"价格")
        self.SetColLabelValue(5, u"购票信息")

        # test all the events
        self.Bind(gridlib.EVT_GRID_CELL_LEFT_CLICK, self.OnCellLeftClick)
        self.Bind(gridlib.EVT_GRID_CELL_RIGHT_CLICK, self.OnCellRightClick)
        self.Bind(gridlib.EVT_GRID_CELL_LEFT_DCLICK, self.OnCellLeftDClick)
        self.Bind(gridlib.EVT_GRID_CELL_RIGHT_DCLICK, self.OnCellRightDClick)

        self.Bind(gridlib.EVT_GRID_LABEL_LEFT_CLICK, self.OnLabelLeftClick)
        self.Bind(gridlib.EVT_GRID_LABEL_RIGHT_CLICK, self.OnLabelRightClick)
        self.Bind(gridlib.EVT_GRID_LABEL_LEFT_DCLICK, self.OnLabelLeftDClick)
        self.Bind(gridlib.EVT_GRID_LABEL_RIGHT_DCLICK, self.OnLabelRightDClick)

        self.Bind(gridlib.EVT_GRID_ROW_SIZE, self.OnRowSize)
        self.Bind(gridlib.EVT_GRID_COL_SIZE, self.OnColSize)

        self.Bind(gridlib.EVT_GRID_RANGE_SELECT, self.OnRangeSelect)
        self.Bind(gridlib.EVT_GRID_CELL_CHANGE, self.OnCellChange)
        self.Bind(gridlib.EVT_GRID_SELECT_CELL, self.OnSelectCell)

        self.Bind(gridlib.EVT_GRID_EDITOR_SHOWN, self.OnEditorShown)
        self.Bind(gridlib.EVT_GRID_EDITOR_HIDDEN, self.OnEditorHidden)
        self.Bind(gridlib.EVT_GRID_EDITOR_CREATED, self.OnEditorCreated)


    def OnCellLeftClick(self, evt):
        evt.Skip()

    def OnCellRightClick(self, evt):
        evt.Skip()

    def OnCellLeftDClick(self, evt):
        evt.Skip()

    def OnCellRightDClick(self, evt):
        evt.Skip()

    def OnLabelLeftClick(self, evt):
        evt.Skip()

    def OnLabelRightClick(self, evt):
        evt.Skip()

    def OnLabelLeftDClick(self, evt):
        evt.Skip()

    def OnLabelRightDClick(self, evt):
        evt.Skip()

    def OnRowSize(self, evt):
        evt.Skip()

    def OnColSize(self, evt):
        evt.Skip()

    def OnRangeSelect(self, evt):
        if evt.Selecting():
            msg = 'Selected'
        else:
            msg = 'Deselected'
        evt.Skip()

    def OnCellChange(self, evt):

        # Show how to stay in a cell that has bad data.  We can't just
        # call SetGridCursor here since we are nested inside one so it
        # won't have any effect.  Instead, set coordinates to move to in
        # idle time.
        row = evt.GetRow()
        col = evt.GetCol()
        value = self.GetCellValue(row, col)
        price = value.split(",")
        if len(price) != 2 or not str(price[0]).isdigit() or not str(price[1]).isdigit():
            self.SetCellValue(row=row, col=col, s=u"不限定")
            wx.MessageBox(u"格式错误,如100,200", "error tip",
                          style=wx.OK | wx.ICON_EXCLAMATION)
            return

        if len(self.grid_data) > row:
            self.grid_data[row]["price"] = price

    def OnIdle(self, evt):
        if self.moveTo != None:
            self.SetGridCursor(self.moveTo[0], self.moveTo[1])
            self.moveTo = None

        evt.Skip()


    def OnSelectCell(self, evt):
        if evt.Selecting():
            msg = 'Selected'
        else:
            msg = 'Deselected'

        # Another way to stay in a cell that has a bad value...
        row = self.GetGridCursorRow()
        col = self.GetGridCursorCol()

        if self.IsCellEditControlEnabled():
            self.HideCellEditControl()
            self.DisableCellEditControl()

        value = self.GetCellValue(row, col)

        if value == 'no good 2':
            return  # cancels the cell selection

        evt.Skip()


    def OnEditorShown(self, evt):
        if evt.GetRow() == 6 and evt.GetCol() == 3 and \
           wx.MessageBox("Are you sure you wish to edit this cell?",
                        "Checking", wx.YES_NO) == wx.NO:
            evt.Veto()
            return

        evt.Skip()


    def OnEditorHidden(self, evt):
        if evt.GetRow() == 6 and evt.GetCol() == 3 and \
           wx.MessageBox("Are you sure you wish to  finish editing this cell?",
                        "Checking", wx.YES_NO) == wx.NO:
            evt.Veto()
            return

        evt.Skip()


    def OnEditorCreated(self, evt):
        pass

    def add_one_row_data(self, ticket):
        row = self.data_row
        self.SetCellValue(row=row, col=0, s=ticket['name'])  # 账号
        self.SetCellValue(row=row, col=1, s=u"待登录" if not ticket["login_status"] else u"已登录")  # 账号状态
        self.SetCellValue(row=row, col=2, s=u"待购票" if not ticket['buy_status'] else u"未知")  # 购票状态
        self.SetCellValue(row=row, col=3, s=str(ticket["buy_times"]))  # 购票次数
        self.SetCellValue(row=row, col=4, s= u"不限定" if not ticket["price"] else ",".join(ticket["price"]))  # 价格
        self.SetCellValue(row=row, col=5, s=ticket['ticket_url'])  # 购票信息
        self.data_row += 1
        row_num = self.GetNumberRows()
        if self.data_row == row_num:
            self.AppendRows(5)
            self.set_read_only()
        return row

    def set_read_only(self):
        for i in range(0, self.GetNumberRows()):
            self.SetRowSize(i, 25)
            for k in range(0, self.GetNumberCols()):
                if k == 4:
                    continue
                self.SetReadOnly(row=i, col=k, isReadOnly=True)

    def set_login_status(self, id, is_success, msg=None):
        if is_success:
            self.SetCellValue(row=id, col=1, s=u"已登录")
        else:
            self.SetCellValue(row=id, col=1, s=msg)

    '''
    '''
    def set_buy_result(self, r):
        for i in range(0, self.GetNumberRows()):
            if self.GetCellValue(row=i, col=0) == r["data"]["name"]:
                if r["code"] == 200:
                    self.SetCellValue(row=i, col=2, s=u"抢票成功[{}]"
                                      .format(datetime.datetime.now().strftime('%Y/%d/%m %H:%M:%S')))
                else:
                    print r["msg"]
                    self.SetCellValue(row=i, col=2, s=u"抢票中")
                self.SetCellValue(row=i, col=3, s=str(int(self.GetCellValue(row=i, col=3)) + 1))

if __name__ == '__main__':
    pass
